import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./ChatBot.css"; 

const API_BASE = "http://localhost:8000/api";

export default function ChatBotPage() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [authError, setAuthError] = useState("");
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

  const axiosConfig = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };

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

  // Fetch sessions on token change
  useEffect(() => {
    if (token) {
      axios
        .get(`${API_BASE}/sessions/`, axiosConfig)
        .then((res) => {
          setSessions(res.data);
          if (res.data.length > 0) {
            setActiveSession(res.data[0].id);
          } else {
            setActiveSession(null);
            setChatHistory([]);
          }
        })
        .catch((err) => {
          if (err.response?.status === 401) handleLogout();
          else alert("Failed to fetch sessions");
        });
    } else {
      setSessions([]);
      setActiveSession(null);
      setChatHistory([]);
    }
  }, [token]);

  // Fetch chat history on session change
  useEffect(() => {
    if (token && activeSession) {
      setChatHistory([]);
      axios
        .get(`${API_BASE}/chat/${activeSession}/`, axiosConfig)
        .then((res) => {
          setChatHistory(res.data);
          setAwaitingPhoneNumber(false);
        })
        .catch(() => alert("Failed to fetch chat history"));
    } else {
      setChatHistory([]);
    }
  }, [activeSession, token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    try {
      const res = await axios.post(`${API_BASE}/login/`, {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setAuthError("");
    } catch {
      setAuthError("Invalid credentials");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Logout? Unsaved data will be lost.")) {
      localStorage.removeItem("token");
      setToken("");
      setChatHistory([]);
      setSessions([]);
      setActiveSession(null);
      setAwaitingPhoneNumber(false);
    }
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    if (awaitingPhoneNumber && !/^\+?\d{7,15}$/.test(message.trim())) {
      alert("Please enter a valid phone number with country code.");
      return;
    }

    setSending(true);

    try {
      const res = await axios.post(
        `${API_BASE}/chat/${activeSession}/`,
        {
          message,
          latitude: location.latitude,
          longitude: location.longitude,
        },
        axiosConfig
      );

      const userMsg = { role: "user", content: message };
      const botMsg = { role: "assistant", content: res.data.reply };

      setChatHistory((prev) => [...prev, userMsg, botMsg]);
      setMessage("");

      if (
        res.data.reply.toLowerCase().includes("please share your phone number")
      ) {
        setAwaitingPhoneNumber(true);
      } else {
        setAwaitingPhoneNumber(false);
        if (ttsEnabled) speakText(res.data.reply);
      }
    } catch (err) {
      alert("Failed to send message.");
      if (err.response?.status === 401) handleLogout();
    } finally {
      setSending(false);
    }
  };

  const handleNewSession = async () => {
    try {
      const res = await axios.post(
        `${API_BASE}/sessions/`,
        { title: `Chat ${sessions.length + 1}` },
        axiosConfig
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
      const res = await axios.put(
        `${API_BASE}/sessions/${id}/`,
        { title: newTitle },
        axiosConfig
      );
      setSessions((prev) => prev.map((s) => (s.id === id ? res.data : s)));
      setEditingSessionId(null);
    } catch {
      alert("Failed to rename session");
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
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");

      const response = await axios.post(
        `${API_BASE}/revup_stt_proxy/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
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

  if (!token) {
    return (
      <div className="login">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input name="username" placeholder="Username" required />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
        {authError && <p style={{ color: "red" }}>{authError}</p>}
      </div>
    );
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
                  onClick={() => !sending && setActiveSession(s.id)}
                  onDoubleClick={() => !sending && startEditing(s.id, s.title)}
                  style={{ cursor: sending ? "not-allowed" : "pointer" }}
                >
                  {s.title}
                </span>
              )}
            </li>
          ))}
        </ul>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="chat-container">
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
          <button
            onClick={toggleRecording}
            disabled={sending}
            style={{ backgroundColor: isRecording ? "red" : "initial" }}
            title={isRecording ? "Stop recording" : "Start recording"}
          >
            🎤
          </button>
        </div>

        <div className="tts-settings">
          <label>
            <input
              type="checkbox"
              checked={ttsEnabled}
              onChange={(e) => setTtsEnabled(e.target.checked)}
              disabled={sending}
            />
            Enable Text-to-Speech
          </label>
          <select
            value={selectedVoice || ""}
            onChange={(e) => setSelectedVoice(e.target.value)}
            disabled={!ttsEnabled || sending}
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
