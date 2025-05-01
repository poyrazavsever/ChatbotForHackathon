import { useState } from "react";

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    const historyForAPI = newMessages.map(msg => ({
      role: msg.role === "agent" ? "model" : msg.role,
      parts: [{ text: msg.content }]
    }));

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: historyForAPI
        }),
      });

      const data = await res.json();


      
      const modelMessage = {
        role: "agent",
        content: data.response
      };
      setMessages([...newMessages, modelMessage]);
    } catch (err) {
      console.error("Hata:", err);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="space-y-2 h-96 overflow-y-auto border rounded p-2 bg-white shadow">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.role === "user" ? "bg-blue-100 text-left" : "bg-gray-100 text-left"
            }`}
          >
            <strong>{msg.role === "user" ? "Sen" : "Ajan"}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded resize-none"
          rows={2}
          placeholder="Mesajınızı yazın..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Gönder
        </button>
      </div>
    </div>
  );
}
