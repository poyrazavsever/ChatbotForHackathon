// components/ChatInterface.js
import { useState } from "react";

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: input,
        history: newMessages.map(m => ({ role: m.role, parts: [{ text: m.content }] }))
      }),
    });

    const data = await res.json();
    setMessages([...newMessages, { role: "agent", content: data.response }]);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`p-2 rounded ${msg.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">Gönder</button>
      </div>
    </div>
  );
}
