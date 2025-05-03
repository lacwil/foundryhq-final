import React, { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Welcome to FoundryBot!" },
  ]);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { role: "user", content: input }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();

      if (data.result) {
        setMessages([...updatedMessages, { role: "bot", content: data.result }]);
        setResponse(data.result);
      } else {
        setMessages([...updatedMessages, { role: "bot", content: "Error generating response." }]);
        setResponse("Error generating response.");
      }
    } catch (err) {
      console.error(err);
      setMessages([...updatedMessages, { role: "bot", content: "Server error." }]);
      setResponse("Server error.");
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row font-sans">
      {/* Sidebar Chat */}
      <div className="w-full md:w-1/3 bg-gray-100 p-4 border-r">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 flex items-center">
          🤖 FoundryBot
        </h1>
        <div className="overflow-y-auto h-[calc(100vh-150px)] pr-2 space-y-2">
          {messages.map((msg, i) => (
            <div key={i} className="text-sm">
              <strong className="capitalize">{msg.role}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <input
            className="flex-1 border p-2 rounded mr-2"
            placeholder="Send a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>

      {/* Canvas Output */}
      <div className="w-full md:w-2/3 p-6 bg-white">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          🧩 Canvas Output
        </h2>
        <div className="whitespace-pre-wrap text-gray-700">
          {response || "Waiting for output..."}
        </div>
      </div>
    </div>
  );
}

export default App;
