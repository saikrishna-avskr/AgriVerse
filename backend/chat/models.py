from django.db import models
from django.contrib.auth.models import User

class ChatSession(models.Model):
    email = models.EmailField()
    title = models.CharField(max_length=255, default="New Chat")
    created_at = models.DateTimeField(auto_now_add=True)
    phone_requested = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.title


class ChatMessage(models.Model):
    session = models.ForeignKey(ChatSession, null=True, blank=True, on_delete=models.CASCADE)
    email = models.EmailField()
    role = models.CharField(max_length=20)  # "user" or "assistant"
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)


class PendingReminder(models.Model):
    email = models.EmailField()
    task = models.CharField(max_length=255)
    time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
