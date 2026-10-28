// src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/sidebar";
import "./App.css";
import { askFoundryBot } from "./utils/openai.js";
import { ChatText } from "./components/ChatText.jsx";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: "Hi there! Let's bring your business idea to life. What kind of business are you thinking of starting?",
      },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    const userText = inputValue.trim();
    if (!userText) return;

    const newMessages = [...messages, { sender: "user", text: userText }];
    setMessages(newMessages);
    setInputValue("");

    if (
      userText.toLowerCase().includes("create logo") ||
      userText.toLowerCase().includes("generate logo") ||
      userText.toLowerCase().includes("design logo") ||
      userText.toLowerCase().includes("logo with options")
    ) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Logo generation is temporarily disabled while secure image previews are prepared." }]);
      return;
    }

    try {
      const reply = await askFoundryBot(newMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })));
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      setBotResponse(reply);
    } catch (error) {
      console.error("❌ OpenAI API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `⚠️ OpenAI API Error: ${error.message || "Unknown error."}`,
        },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="app-layout">
      <div className="topbar">
        <div className="project-dropdown">
          <span role="img" aria-label="brain">🧠</span>
          <label htmlFor="projectSelect">Project:</label>
          <select id="projectSelect" value="New Project" disabled>
            <option>New Project</option>
          </select>
          <button onClick={() => window.location.reload()}>➕</button>
        </div>
        <div className="topbar-buttons">
          <button className="preview-btn">💡 Preview</button>
          <button className="deploy-btn">🚀 Deploy</button>
        </div>
      </div>

      <div className="main-columns">
        <div className="chat-column">
          <Sidebar />
          <div className="chat-history">
            {messages.map((msg, idx) => (
              <div key={idx} className="chat-message">
                <strong>{msg.sender}:</strong> <ChatText text={msg.text} />
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input-row">
            <input
              placeholder="Ask FoundryBot..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>

        <div className="canvas-column">
          <div className="canvas-header">
            <span role="img" aria-label="brick">🧱</span> Canvas Output (text preview):
          </div>
          <div className="canvas-box">
            {botResponse ? (
              <ChatText text={botResponse} />
            ) : (
              <em>Nothing yet. Ask FoundryBot to start building!</em>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
