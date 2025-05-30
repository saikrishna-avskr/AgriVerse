import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./ChatBot.css";
import { useAuth, useUser, SignIn, SignOutButton } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";

const API_BASE = "http://localhost:8000/api";

const getAxiosConfig = async () => {
  const { getToken } = useAuth();
  const token = await getToken({ template: "updated" });
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export default function ChatBotPage() {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [sending, setSending] = useState(false);
  const [awaitingPhoneNumber, setAwaitingPhoneNumber] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  // Get location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          console.warn("Geolocation permission denied or error:", err.message);
        }
      );
    }
  }, []);

  // Load voices for TTS
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name);
      }
    };
    if (window.speechSynthesis) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoice]);

  // Fetch sessions when signed in
  useEffect(() => {
    if (isSignedIn) {
      fetchSessions();
    }
  }, [isSignedIn]);

  const fetchSessions = async () => {
    const token = await getToken({ template: "updated" });
    console.log("Fetching sessions with token:", token);
    const res = await fetch(`${API_BASE}/sessions/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setSessions(await res.json());
    }
  };

  const fetchChatHistory = async (sessionId) => {
    const token = await getToken({ template: "updated" });
    const res = await fetch(`${API_BASE}/chat/${sessionId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setChatHistory(await res.json());
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !activeSession) return;
    setSending(true);
    const token = await getToken({ template: "updated" });
    const res = await fetch(`${API_BASE}/chat/${activeSession}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
        latitude: location.latitude,
        longitude: location.longitude,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: data.reply },
      ]);
      setMessage("");
    }
    setSending(false);
  };

  const handleNewSession = async () => {
    try {
      const token = await getToken({ template: "updated" });
      const res = await axios.post(
        `${API_BASE}/sessions/`,
        { title: `Chat ${sessions.length + 1}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessions((prev) => [res.data, ...prev]);
      setActiveSession(res.data.id);
      setChatHistory([]);
      setAwaitingPhoneNumber(false);
    } catch {
      alert("Failed to create new chat session.");
    }
  };

  const startEditing = (id, currentTitle) => {
    setEditingSessionId(id);
    setNewTitle(currentTitle);
  };

  const saveTitle = async (id) => {
    if (!newTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }
    try {
      const token = await getToken({ template: "updated" });
      const res = await axios.put(
        `${API_BASE}/sessions/${id}/`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessions((prev) => prev.map((s) => (s.id === id ? res.data : s)));
      setEditingSessionId(null);
    } catch {
      alert("Failed to rename session");
    }
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm("Are you sure you want to delete this chat?")) return;
    try {
      const token = await getToken({ template: "updated" });
      await axios.delete(`${API_BASE}/sessions/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSession === id) {
        setActiveSession(null);
        setChatHistory([]);
      }
    } catch {
      alert("Failed to delete chat session.");
    }
  };

  useEffect(() => {
    let recorder;
    let stream;

    if (isRecording) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((micStream) => {
          stream = micStream;
          recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);

          recorder.start();

          recorder.ondataavailable = (e) => {
            setAudioChunks((prev) => [...prev, e.data]);
          };

          recorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            sendAudioToRevUp(audioBlob);
            setAudioChunks([]);
            stream.getTracks().forEach((track) => track.stop());
          };
        })
        .catch(() => {
          alert("Microphone permission denied");
          setIsRecording(false);
        });
    }

    return () => {
      if (recorder?.state === "recording") recorder.stop();
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [isRecording]);

  const sendAudioToRevUp = async (audioBlob) => {
    try {
      const config = await getAxiosConfig();
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");

      // Add multipart header
      config.headers["Content-Type"] = "multipart/form-data";

      const response = await axios.post(
        `${API_BASE}/revup_stt_proxy/`,
        formData,
        config
      );

      if (response.data?.transcript) {
        setMessage(
          (prev) => (prev ? prev + " " : "") + response.data.transcript
        );
      }
    } catch {
      alert("Speech recognition failed. Please try again.");
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      mediaRecorder?.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
    }
  };

  if (!isSignedIn) {
    return <SignIn />;
  }

  return (
    <div className="app">
      <div className="sidebar">
        <h3>Chats</h3>
        <button onClick={handleNewSession} disabled={sending}>
          + New Chat
        </button>
        <ul>
          {sessions.map((s) => (
            <li key={s.id} className={s.id === activeSession ? "active" : ""}>
              <div className="chat-session-item">
                {editingSessionId === s.id ? (
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={() => saveTitle(s.id)}
                    autoFocus
                    disabled={sending}
                  />
                ) : (
                  <span
                    className="session-title"
                    onClick={() => {
                      !sending && setActiveSession(s.id);
                      fetchChatHistory(s.id);
                    }}
                    onDoubleClick={() =>
                      !sending && startEditing(s.id, s.title)
                    }
                    style={{ cursor: sending ? "not-allowed" : "pointer" }}
                  >
                    {s.title}
                  </span>
                )}

                <button
                  onClick={() => handleDeleteSession(s.id)}
                  disabled={sending}
                  title="Delete this chat"
                  className="delete-button"
                  style={{ margin: "auto" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ verticalAlign: "middle" }}
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-container">
        <Navbar />
        <div className="chat-history">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${msg.role === "user" ? "user" : "bot"}`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder={
              awaitingPhoneNumber
                ? "Please enter your phone number with country code (+123456789)..."
                : "Type your message here..."
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={sending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!sending) handleSend();
              }
            }}
          />
          <button onClick={handleSend} disabled={sending}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
