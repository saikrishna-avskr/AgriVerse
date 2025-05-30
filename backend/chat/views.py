import os
import re
import requests
from dotenv import load_dotenv
import google.generativeai as genai

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils.timezone import now

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser

from .models import ChatMessage, ChatSession, PendingReminder
from .utils import (
    check_for_reminder,
    trigger_price_scraping,
    get_weather_info,
    get_email_from_clerk_request
)
from .tasks import send_reminder_sms

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

# Regex for phone and coordinates
PHONE_REGEX = re.compile(r'^\+?\d{10,15}$')
COORDS_REGEX = re.compile(r'([-+]?\d{1,2}(?:\.\d+)?),\s*([-+]?\d{1,3}(?:\.\d+)?)')


class ClearChatView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request):
        email = get_email_from_clerk_request(request)
        if not email:
            return Response({"error": "Unauthorized"}, status=401)
        ChatMessage.objects.filter(email=email).delete()
        ChatSession.objects.filter(email=email).delete()
        return Response({"status": "Chat history cleared."})


class ChatSessionView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        email = get_email_from_clerk_request(request)
        if not email:
            return Response({"error": "Unauthorized"}, status=401)
        sessions = ChatSession.objects.filter(email=email).order_by("-created_at")
        data = [{"id": s.id, "title": s.title, "created_at": s.created_at} for s in sessions]
        print(data)
        return Response(data)

    def post(self, request):
        email = get_email_from_clerk_request(request)
        print("entering post")
        if not email:
            return Response({"error": "Unauthorized"}, status=401)
        title = request.data.get("title", "New Chat")
        session = ChatSession.objects.create(email=email, title=title)
        return Response({
            "id": session.id,
            "title": session.title,
            "created_at": session.created_at
        }, status=status.HTTP_201_CREATED)

    def put(self, request, session_id=None):
        email = get_email_from_clerk_request(request)
        if not email:
            return Response({"error": "Unauthorized"}, status=401)
        if not session_id:
            return Response({"error": "Session ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        title = request.data.get("title")
        if not title:
            return Response({"error": "Title is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            session = ChatSession.objects.get(id=session_id, email=email)
            session.title = title
            session.save()
            return Response({
                "id": session.id,
                "title": session.title,
                "created_at": session.created_at
            })
        except ChatSession.DoesNotExist:
            return Response({"error": "Session not found."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, session_id=None):
        email = get_email_from_clerk_request(request)
        if not email:
            return Response({"error": "Unauthorized"}, status=401)
        if not session_id:
            return Response({"error": "Session ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            session = ChatSession.objects.get(id=session_id, email=email)
            session.delete()
            return Response({"status": "Session deleted."})
        except ChatSession.DoesNotExist:
            return Response({"error": "Session not found."}, status=status.HTTP_404_NOT_FOUND)

class GeminiChatView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, session_id):
        email = get_email_from_clerk_request(request)
        if not email:
            return Response({"error": "Unauthorized"}, status=401)
        user_message = request.data.get("message", "").strip()
        latitude = request.data.get("latitude")
        longitude = request.data.get("longitude")
        actions = []

        try:
            session = ChatSession.objects.get(id=session_id, email=email)

            if not session.phone_number:
                if PHONE_REGEX.match(user_message):
                    session.phone_number = user_message
                    session.save()
                    reply = f"Thanks for providing your phone number: {session.phone_number}. How can I assist you today?"
                    ChatMessage.objects.create(email=email, role="assistant", content=reply, session=session)
                    return Response({"reply": reply, "actions": []})
                else:
                    reply = "Hi! To get started, please share your phone number (include country code if applicable)."
                    return Response({"reply": reply, "actions": []})

            past_msgs = ChatMessage.objects.filter(email=email, session_id=session_id).order_by("timestamp")
            history = [{"role": m.role, "parts": [m.content]} for m in past_msgs]
            system_prompt = (
                "You are AgriBot, an expert agricultural assistant. You ONLY respond to questions related to farming and agriculture. "
                "Your responses must be accurate, practical, and focused on topics like crop recommendations, weather advice, pest control, fertilizers, planting schedules, "
                "soil care, yield predictions, and market prices. Do NOT answer any non-agriculture questions. If the user asks anything off-topic, politely guide them back to agriculture. You can also schedulre reminders for the user. "
            )

            session_chat = model.start_chat(history=[{"role": "user", "parts": [system_prompt]}] + history)

            if user_message.lower() == "yes":
                pending = PendingReminder.objects.filter(email=email).last()
                if pending:
                    send_reminder_sms.apply_async(
                        (email, session.phone_number, pending.task),
                        eta=pending.time
                    )
                    actions.append(f"📲 Reminder confirmed and scheduled: {pending.task} at {pending.time.strftime('%Y-%m-%d %H:%M')}")
                    pending.delete()
                ai_reply = "Reminder confirmed and scheduled."
            else:
                response = session_chat.send_message(user_message)
                ai_reply = response.text

                ChatMessage.objects.create(email=email, role="user", content=user_message, session=session)
                ChatMessage.objects.create(email=email, role="assistant", content=ai_reply, session=session)

                reminder_response = check_for_reminder(email, user_message, from_gemini=True)
                if reminder_response:
                    actions.append(reminder_response)

                if "weather" in user_message.lower():
                    if latitude is not None and longitude is not None:
                        weather_response = get_weather_info(lat=latitude, lon=longitude)
                        return Response({
                            "reply": weather_response,
                            "actions": actions
                        })
                    else:
                        weather_response = get_weather_info()
                    if weather_response:
                        actions.append(weather_response)

                if any(word in user_message.lower() for word in ["price", "buy", "cost", "amazon", "flipkart"]):
                    product_response = trigger_price_scraping(user_message)
                    if product_response:
                        actions.append(product_response)
            print(actions)
            return Response({
                "reply": ai_reply,
                "actions": actions
            })

        except Exception as e:
            print("GeminiChatView Error:", str(e))
            return Response({"error": "Internal server error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, session_id):
        email = get_email_from_clerk_request(request)
        if not email:
            return Response({"error": "Unauthorized"}, status=401)
        messages = ChatMessage.objects.filter(email=email, session_id=session_id).order_by("timestamp")
        history = [{"role": m.role, "content": m.content} for m in messages]
        return Response(history)


@csrf_exempt
@api_view(["POST"])
@parser_classes([MultiPartParser])
def revup_stt_proxy(request):
    audio_file = request.FILES.get("audio")
    if not audio_file:
        return JsonResponse({"error": "No audio file provided."}, status=400)

    headers = {
        "Authorization": f"Bearer {os.getenv('REVUP_API_KEY')}",
    }

    files = {
        "audio": (audio_file.name, audio_file.read(), audio_file.content_type)
    }

    try:
        resp = requests.post(
            "https://api.revup.reverieinc.com/stt/recognize",
            headers=headers,
            files=files,
            timeout=10
        )
        return JsonResponse(resp.json(), status=resp.status_code)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
