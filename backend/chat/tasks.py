from celery import shared_task
from .models import User
from .twilio_helper import send_sms

@shared_task
def send_reminder_sms(user_id, phone_number, task):
    try:
        send_sms(phone_number, f"⏰ Reminder: {task}")
        print(f"✅ Reminder SMS sent to {phone_number}: {task}")
    except Exception as e:
        print("❌ Failed to send reminder:", str(e))
