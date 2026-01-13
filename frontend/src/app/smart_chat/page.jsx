"use client";
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export default function ChatGPTClone() {
  const [chats, setChats] = useState([]); // [{id, title, messages: []}]
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Load chats from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('legalbot_chats');
    if (saved) {
      const parsed = JSON.parse(saved);
      setChats(parsed);
      if (parsed.length > 0) setActiveChatId(parsed[0].id);
    }
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('legalbot_chats', JSON.stringify(chats));
    } else {
      localStorage.removeItem('legalbot_chats');
    }
  }, [chats]);

  const activeChat = chats.find(c => c.id === activeChatId) || { messages: [] };

  const handleBack = () => window.history.back();

  const startNewChat = () => {
    const newId = Date.now().toString();
    const newChat = { id: newId, title: "New Conversation", messages: [] };
    setChats([newChat, ...chats]);
    setActiveChatId(newId);
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation(); // Prevent selecting the chat when clicking delete
    const updatedChats = chats.filter(c => c.id !== chatId);
    setChats(updatedChats);
    
    // If deleting active chat, switch to first available chat or null
    if (activeChatId === chatId) {
      setActiveChatId(updatedChats.length > 0 ? updatedChats[0].id : null);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    let currentId = activeChatId;
    let currentChats = [...chats];

    if (!currentId) {
      currentId = Date.now().toString();
      const newChat = { id: currentId, title: input.substring(0, 20), messages: [] };
      currentChats = [newChat];
      setActiveChatId(currentId);
    }

    const userMsg = { role: 'user', content: input };
    const updatedMessages = [...activeChat.messages, userMsg];

    setChats(currentChats.map(c => 
      c.id === currentId ? { ...c, messages: updatedMessages, title: c.messages.length === 0 ? input.substring(0, 25) : c.title } : c
    ));
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();
      const botMsg = { role: 'assistant', content: data.response };

      setChats(prev => prev.map(c => 
        c.id === currentId ? { ...c, messages: [...updatedMessages, botMsg] } : c
      ));
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen relative overflow-hidden bg-green-50">
      {/* Background Blobs */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Sidebar */}
      <div className="w-64 bg-white/90 backdrop-blur-md p-3 flex flex-col hidden md:flex relative z-10 shadow-lg rounded-tr-2xl rounded-br-2xl border-r-2 border-green-200">
        {/* Back Button */}
        <button 
          onClick={handleBack} 
          className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg mb-3 transition shadow-md font-medium"
        >
          ← Back
        </button>

        {/* New Chat Button */}
        <button 
          onClick={startNewChat} 
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white p-2 rounded-lg hover:from-green-500 hover:to-lime-500 transition mb-4 shadow-md font-semibold"
        >
          <span className="text-xl">+</span> New Chat
        </button>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {chats.map(chat => (
            <div 
              key={chat.id} 
              className={`flex items-center justify-between group w-full p-2 rounded-lg transition
                ${activeChatId === chat.id ? 'bg-green-100' : 'hover:bg-green-50'}`}
            >
              <button 
                onClick={() => setActiveChatId(chat.id)}
                className="flex-1 text-left truncate text-sm font-medium text-gray-900"
              >
                {chat.title}
              </button>
              <button
                onClick={(e) => deleteChat(chat.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                title="Delete chat"
              >
                <Trash2 size={16} className="text-red-600" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10">
        <div className="flex-1 overflow-y-auto p-4 md:p-12 space-y-6">
          {activeChat.messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-green-800 text-2xl font-bold">
              Catalyst AI
            </div>
          )}

          {activeChat.messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[80%] 
                ${m.role === 'user' 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white' 
                  : 'bg-white/80 text-green-900 border border-green-200'}`}
              >
                <p className="text-xs font-bold mb-1 uppercase">{m.role}</p>
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}

          {loading && <div className="text-green-700 animate-pulse font-semibold">Thinking...</div>}
        </div>

        {/* Input */}
        <div className="p-4 max-w-3xl mx-auto w-full">
          <div className="relative flex items-center bg-white/80 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border-2 border-green-200">
            <input 
              className="flex-1 bg-transparent border-none outline-none p-2 text-green-900 placeholder-green-600"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button 
              onClick={sendMessage} 
              className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg px-3 py-1 font-bold hover:from-green-500 hover:to-lime-500 transition"
            >
              ↑
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px,0px) scale(1); }
          33% { transform: translate(30px,-50px) scale(1.1); }
          66% { transform: translate(-20px,20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}