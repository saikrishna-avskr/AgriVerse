from django.urls import path
from .views import (
    GeminiChatView,
    ChatSessionView,
    ClearChatView,
)
from rest_framework.authtoken.views import obtain_auth_token

from .views import revup_stt_proxy

# URL patterns for chat-related API endpoints
urlpatterns = [
    # 🔐 Login endpoint for obtaining authentication token
    path('api/login/', obtain_auth_token, name='api_token_auth'),

    # 💬 Endpoints for managing chat sessions
    # List all sessions or create a new session
    path("sessions/", ChatSessionView.as_view(), name="chat-sessions"),
    # Retrieve, update, or delete a specific session by ID
    path('sessions/<int:session_id>/', ChatSessionView.as_view()),  # for PUT

    # 🤖 Endpoint for handling chat messages within a specific session
    path("chat/<int:session_id>/", GeminiChatView.as_view(), name="chat-by-session"),

    # 🧹 Endpoint to clear chat history for a specific session
    path("chat/<int:session_id>/clear/", ClearChatView.as_view(), name="clear-chat"),

    # 🎤 Proxy endpoint for speech-to-text service
    path("revup_stt_proxy/", revup_stt_proxy, name="revup_stt_proxy"),
]
