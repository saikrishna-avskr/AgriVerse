from twilio.rest import Client
import os

account_sid = os.getenv("TWILIO_SID")
auth_token = os.getenv("TWILIO_AUTH")
twilio_number = os.getenv("TWILIO_PHONE")

client = Client(account_sid, auth_token)

def send_sms(to, body):
    message = client.messages.create(
        body=body,
        from_=twilio_number,
        to=to
    )
    return message.sid
