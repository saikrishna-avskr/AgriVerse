from celery import shared_task
from .models import User
from .twilio_helper import send_sms

@shared_task
def send_reminder_sms(user_id, phone_number, task):
    """
    Celery task to send a reminder SMS to a user.

    Args:
        user_id (int): The ID of the user to send the reminder to.
        phone_number (str): The recipient's phone number.
        task (str): The reminder message or task description.
    """
    try:
        # Send the SMS using the Twilio helper function
        send_sms(phone_number, f"⏰ Reminder: {task}")
        print(f"✅ Reminder SMS sent to {phone_number}: {task}")
    except Exception as e:
        # Log any errors that occur during SMS sending
        print("❌ Failed to send reminder:", str(e))
