from twilio.rest import Client
import os

# Retrieve Twilio credentials and phone number from environment variables
account_sid = os.getenv("TWILIO_SID")
auth_token = os.getenv("TWILIO_AUTH")
twilio_number = os.getenv("TWILIO_PHONE")

# Initialize the Twilio client with the retrieved credentials
client = Client(account_sid, auth_token)

def send_sms(to, body):
    """
    Send an SMS message using the Twilio API.

    Args:
        to (str): The recipient's phone number (in E.164 format).
        body (str): The text message to send.

    Returns:
        str: The SID of the sent message.
    """
    message = client.messages.create(
        body=body,
        from_=twilio_number,
        to=to
    )
    return message.sid
