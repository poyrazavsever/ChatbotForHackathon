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
        body: JSON.stringify({ history: historyForAPI }),
      });

      const data = await res.json();
      const modelMessage = { role: "agent", content: data.response };
      setMessages([...newMessages, modelMessage]);
    } catch (err) {
      console.error("Hata:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-16 bg-gray-900 px-4">

        <div>
            <img src="logo.png" alt="logoGdg" className="w-72"/>
        </div>

        <div className="w-full max-w-2xl bg-gray-800 text-white rounded-xl shadow-lg p-6 border border-gray-700">
            <h2 className="text-center text-2xl font-bold mb-4">GDG Chat Bot</h2>

            <div className="h-96 overflow-y-auto space-y-4 p-2">
            {messages.map((msg, i) => (
                <div
                key={i}
                className={`max-w-xs md:max-w-sm lg:max-w-md p-3 rounded-xl text-sm ${
                    msg.role === "user"
                    ? "bg-purple-600 text-white ml-auto text-right"
                    : "bg-gray-700 text-white mr-auto text-left"
                }`}
                >
                {msg.content}
                </div>
            ))}
            </div>

            <div className="mt-4 flex gap-2">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-gray-700 text-white border border-gray-600 resize-none"
                rows={2}
                placeholder="Bir mesaj yazın..."
            />
            <button
                onClick={sendMessage}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all cursor-pointer"
            >
                Gönder
            </button>
            </div>
        </div>
    </div>
  );
}
