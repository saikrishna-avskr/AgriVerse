import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./ChatBot.css";
import { useAuth, useUser, SignIn, SignOutButton } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";

const API_BASE = "http://localhost:8000/api";

const getAxiosConfig = async (getToken) => {
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
  const [sending, setSending] = useState(false);
  const [awaitingPhoneNumber, setAwaitingPhoneNumber] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  // Use refs to maintain stable references
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

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
      const newMessages = [
        ...chatHistory,
        { role: "user", content: message },
        { role: "assistant", content: data.reply },
      ];
      setChatHistory(newMessages);
      setMessage("");

      // Speak the bot's response
      if (ttsEnabled && data.reply) {
        // Small delay to ensure the message is rendered first
        setTimeout(() => speakText(data.reply), 100);
      }
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

  // Text-to-Speech functionality
  const speakText = (text) => {
    if (!ttsEnabled || !text.trim()) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Set voice if selected
    if (selectedVoice) {
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }
    }

    // Configure speech settings
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Error handling
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
    };

    window.speechSynthesis.speak(utterance);
  };

  const sendAudioToRevUp = async (audioBlob) => {
    try {
      const config = await getAxiosConfig(getToken);
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");

      // Remove Content-Type header to let browser set it with boundary
      delete config.headers["Content-Type"];

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
    } catch (error) {
      console.error("Speech recognition error:", error);
      alert("Speech recognition failed. Please try again.");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        sendAudioToRevUp(audioBlob);

        // Clean up
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        audioChunksRef.current = [];
      };

      recorder.start(100); // Collect data every 100ms
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Microphone permission denied or not available");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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
              {msg.role === "assistant" && (
                <button
                  className="speak-button"
                  onClick={() => speakText(msg.content)}
                  title="Read aloud"
                  disabled={!ttsEnabled}
                >
                  🔊
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="tts-controls">
          <label>
            <input
              type="checkbox"
              checked={ttsEnabled}
              onChange={(e) => setTtsEnabled(e.target.checked)}
            />
            Enable Text-to-Speech
          </label>

          {voices.length > 0 && (
            <select
              value={selectedVoice || ""}
              onChange={(e) => setSelectedVoice(e.target.value)}
              disabled={!ttsEnabled}
            >
              <option value="">Default Voice</option>
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => window.speechSynthesis.cancel()}
            disabled={!ttsEnabled}
            title="Stop speaking"
          >
            🔇 Stop
          </button>
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
          <button
            onClick={toggleRecording}
            disabled={sending}
            className={`record-button ${isRecording ? "recording" : ""}`}
            title={isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? "🔴" : "🎤"}
          </button>
          <button onClick={handleSend} disabled={sending}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
