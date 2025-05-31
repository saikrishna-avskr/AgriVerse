from rest_framework import serializers
from .models import ChatSession, ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = '__all__'

class ChatSessionSerializer(serializers.ModelSerializer):
    """
    Serializer for the ChatSession model.

    Serializes the following fields:
        - id: Unique identifier for the chat session.
        - title: Title or name of the chat session.
        - created_at: Timestamp indicating when the chat session was created.
        - messages: List of related chat messages, serialized using ChatMessageSerializer (read-only).

    The 'messages' field is nested and read-only, ensuring that messages can be viewed but not modified through this serializer.
    """
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatSession
        fields = ['id', 'title', 'created_at', 'messages']
