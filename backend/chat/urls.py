from django.urls import path
from .views import (
    GeminiChatView,
    ChatSessionView,
    ClearChatView,
)
from rest_framework.authtoken.views import obtain_auth_token

from .views import revup_stt_proxy
urlpatterns = [
    # 🔐 Login endpoint
    path('api/login/', obtain_auth_token, name='api_token_auth'),

    # 💬 Chat sessions
    path("sessions/", ChatSessionView.as_view(), name="chat-sessions"),
    path('sessions/<int:session_id>/', ChatSessionView.as_view()),  # for PUT


    # 🤖 Chat per session
    path("chat/<int:session_id>/", GeminiChatView.as_view(), name="chat-by-session"),

    # 🧹 Clear chat
    path("chat/<int:session_id>/clear/", ClearChatView.as_view(), name="clear-chat"),
    path("revup_stt_proxy/", revup_stt_proxy, name="revup_stt_proxy"),
]
