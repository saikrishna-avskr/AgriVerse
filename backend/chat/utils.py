import os
import json
import datetime
import requests
from dotenv import load_dotenv
from django.utils.timezone import make_aware
import google.generativeai as genai
import jwt

from .twilio_helper import send_sms
from .scraper import scrape_prices
from .weather import get_current_weather
from .models import PendingReminder
from .tasks import send_reminder_sms  # Celery task

# Load environment and configure Gemini
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")


# ⏰ Schedule reminder with Celery
def schedule_reminder(user, session, task, time_str):
    try:
        time = make_aware(datetime.datetime.strptime(time_str, "%Y-%m-%d %H:%M"))
        delay = (time - datetime.datetime.now()).total_seconds()
        send_reminder_sms.apply_async((user.id, session.phone_number, task), countdown=delay)
        return True
    except Exception as e:
        print("Error scheduling reminder:", e)
        return False

def check_for_reminder(user, message, session=None, from_gemini=False):
    prompt = f"""
    You are an AI assistant. Determine if the user is asking to set a reminder.

    Respond with a JSON in one of the following formats:
    Ensure that the time is in the format  '%Y-%m-%d %H:%M'
    1. If it's a reminder:
    {{
        "is_reminder": true,
        "task": "Check irrigation system",
        "time": "2025-05-20 18:00"
    }}

    2. If it's not a reminder:
    {{
        "is_reminder": false
    }}

    User message: "{message}"
    """

    try:
        response = model.generate_content(prompt)
        print("Gemini response:", response.text)
        parsed = response.text.strip().removeprefix("```json").removesuffix("```").strip()
        result = json.loads(parsed)

        if result.get("is_reminder"):
            task = result.get("task", "your task")
            time_str = result.get("time")
            if not time_str:
                return None

            reminder_time = make_aware(datetime.datetime.strptime(time_str, "%Y-%m-%d %H:%M"))

            # Schedule reminder directly (no confirmation)
            if session and session.phone_number:
                send_reminder_sms.apply_async(
                    (user.id, session.phone_number, task),
                    eta=reminder_time
                )
                return f"📲 Reminder set: {task} at {reminder_time.strftime('%Y-%m-%d %H:%M')}"

    except Exception as e:
        print("Reminder parsing error:", str(e))

    return None


# ✅ Called when user confirms a pending reminder
def confirm_pending_reminder(user, session):
    try:
        reminder = PendingReminder.objects.filter(user=user).latest("created_at")
        if reminder:
            send_reminder_sms.apply_async(
                (user.id, session.phone_number, reminder.task),
                eta=reminder.time
            )
            reminder.delete()
            return f"✅ Reminder confirmed and scheduled: {reminder.task} at {reminder.time.strftime('%Y-%m-%d %H:%M')}"
    except PendingReminder.DoesNotExist:
        return "⚠️ No pending reminder found."
    except Exception as e:
        print("Error confirming reminder:", e)

    return "⚠️ Failed to confirm reminder."


# 🛒 Price scraping
def trigger_price_scraping(message):
    try:
        product = message.split("price of")[-1].strip() if "price of" in message else message
        data = scrape_prices(product)
        if not data:
            return f"❌ No price data found for '{product}'"
        return f"🛒 Market Prices for {product}:\n" + "\n".join([f"{site}: ₹{price}" for site, price in data.items()])
    except Exception as e:
        print("Price scraping error:", e)
        return "⚠️ Failed to fetch price information."



def get_weather_info(lat=None, lon=None):
    try:
        # Step 1: Build API URL
        if lat is not None and lon is not None:
            location = f"{lat},{lon}"
        else:
            location = "auto:ip"

        api_key = os.getenv("WEATHER_API_KEY")
        url = f"https://api.weatherapi.com/v1/current.json?key={api_key}&q={location}"

        # Step 2: Make API call
        resp = requests.get(url, timeout=10)
        data = resp.json()

        # Step 3: Extract basic weather info
        location_name = data.get("location", {}).get("name", "your area")
        country = data.get("location", {}).get("country", "")
        condition = data.get("current", {}).get("condition", {}).get("text", "")
        temperature = data.get("current", {}).get("temp_c", "")

        # Step 4: Build a prompt to Gemini
        raw_data_summary = f"Weather update for {location_name}, {country}: condition is {condition}, temperature is {temperature}°C."
        prompt = f"""
        I got this weather data from an API:

        {raw_data_summary}

        Can you rephrase this in a friendly, concise style for a chatbot message?
        Give three lines as to how weather complements agriculture, and how it can be used to improve crop yield.
        Only give the final output, no extra text or explanation. Describe the weather in a friendly way, like "It's sunny and 25°C in New Delhi." or "It's raining and 18°C in London.".
        """

        # Step 5: Use Gemini to enhance output
        response = model.generate_content(prompt)
        reply = response.text.strip()

        return reply

    except Exception as e:
        return f"❌ Failed to fetch weather data: {str(e)}"


def get_email_from_clerk_request(request):
    auth_header = request.headers.get("Authorization")
    #print("Authorization header:", auth_header)  # Add this line to decode
    if not auth_header or not auth_header.startswith("Bearer"):
        return None
    token = auth_header.split(" ")[1]
    try:
        decoded = jwt.decode(token, options={"verify_signature": False})
        #print("Decoded JWT:", decoded)  # Add this line to decode
        return decoded.get("email")
    except Exception as e:
        print("JWT decode error:", e)
        return None


