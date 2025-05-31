from django.db import models
from django.contrib.auth.models import User

class ChatSession(models.Model):
    # Stores the email of the user who started the chat session
    email = models.EmailField()
    # Title of the chat session, defaults to "New Chat"
    title = models.CharField(max_length=255, default="New Chat")
    # Timestamp when the chat session was created
    created_at = models.DateTimeField(auto_now_add=True)
    # Indicates if the user requested a phone call during the session
    phone_requested = models.BooleanField(default=False)
    # Optional phone number provided by the user
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        # Returns the title of the chat session for display purposes
        return self.title


class ChatMessage(models.Model):
    # Reference to the related chat session; can be null or blank
    session = models.ForeignKey(ChatSession, null=True, blank=True, on_delete=models.CASCADE)
    # Email of the sender (user or assistant)
    email = models.EmailField()
    # Role of the sender: "user" or "assistant"
    role = models.CharField(max_length=20)  # "user" or "assistant"
    # Content of the chat message
    content = models.TextField()
    # Timestamp when the message was created
    timestamp = models.DateTimeField(auto_now_add=True)


class PendingReminder(models.Model):
    # Email of the user who set the reminder
    email = models.EmailField()
    # Description of the task to be reminded about
    task = models.CharField(max_length=255)
    # Scheduled time for the reminder
    time = models.DateTimeField()
    # Timestamp when the reminder was created
    created_at = models.DateTimeField(auto_now_add=True)

class UserProfile(models.Model):
    # One-to-one relationship with Django's built-in User model
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # Optional phone number for the user
    phone_number = models.CharField(max_length=15, blank=True, null=True)
