"use client";

import { useState, useEffect, useRef } from "react";

export default function Chatbot() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // -----------------------------
  // SEND TEXT MESSAGE
  // -----------------------------
  async function sendMessage(text) {
    if (!text.trim()) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8080/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, history: messages }),
      });
      const data = await res.json();
      const botMessage = { role: "assistant", content: data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to server." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // START VOICE RECORDING
  // -----------------------------
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    audioChunksRef.current = [];
    mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  // -----------------------------
  // STOP RECORDING → STT → SEND
  // -----------------------------
  const stopRecording = () => {
    return new Promise((resolve) => {
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.wav");

        try {
          const res = await fetch("http://127.0.0.1:8080/stt", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          await sendMessage(data.text);
        } catch (err) {
          console.error(err);
          setMessages((prev) => [...prev, { role: "assistant", content: "STT failed." }]);
        }
        resolve();
      };

      mediaRecorderRef.current.stop();
      setRecording(false);
    });
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="font-sans">
      {/* Floating AI Button */}
      {!chatOpen && (
        <button
          className="fixed bottom-5 right-5 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center animate-bounce-slow"
          style={{ background: "linear-gradient(135deg, #4F46E5, #6366F1)" }}
          onClick={() => setChatOpen(true)}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712098.png"
            alt="Catalyst"
            className="w-10 h-10"
          />
        </button>
      )}

      {/* Chat Modal */}
      {chatOpen && (
        <div className="fixed bottom-20 right-5 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden animate-scale-up">
          {/* Header */}
          <div
            className="px-4 py-3 font-bold text-lg flex justify-between items-center rounded-t-3xl shadow-inner"
            style={{ background: "linear-gradient(90deg, #4F46E5, #6366F1)", color: "#fff" }}
          >
            <span>Catalyst AI</span>
            <button
              className="text-white font-bold text-lg hover:text-gray-200 transition"
              onClick={() => setChatOpen(false)}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 h-72 overflow-y-auto flex flex-col space-y-2 bg-gray-50 text-black">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl max-w-[75%] transition-all duration-500 ${
                  msg.role === "user"
                    ? "bg-blue-200 self-end"  // black text inherited
                    : "bg-gray-100 self-start"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="text-gray-500 text-sm animate-pulse self-start">Thinking…</div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          {/* Input & Voice */}
          <div className="flex p-2 border-t border-gray-200 bg-gray-50 rounded-b-3xl gap-1 text-black">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-l-2xl px-3 py-2 focus:outline-none focus:ring focus:ring-purple-300 text-black"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (sendMessage(input), setInput(""))}
            />
            <button
              className="px-3 py-2 bg-blue-600 text-white rounded-r-2xl hover:bg-blue-700"
              onClick={() => {
                sendMessage(input);
                setInput("");
              }}
            >
              Send
            </button>

            {!recording ? (
              <button
                className="px-3 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 ml-1"
                onClick={startRecording}
              >
                🎤
              </button>
            ) : (
              <button
                className="px-3 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 ml-1"
                onClick={stopRecording}
              >
                ⏹
              </button>
            )}
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes scale-up { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-scale-up { animation: scale-up 0.3s ease-out; }

        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .animate-bounce-slow { animation: bounce-slow 2s infinite; }
      `}</style>
    </div>
  );
}
