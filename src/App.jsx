// src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [logoWizard, setLogoWizard] = useState({ active: false, step: 0, name: "", industry: "", style: "", icon: "" });
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

  const forceCanvasUpdate = (html) => {
    setBotResponse(null);
    requestAnimationFrame(() => setBotResponse(html));
  };

  const handleSendMessage = async () => {
    const userText = inputValue.trim();
    if (!userText) return;

    const newMessages = [...messages, { sender: "user", text: userText }];
    setMessages(newMessages);
    setInputValue("");

    if (logoWizard.active) {
      let updated = { ...logoWizard };
      switch (logoWizard.step) {
        case 0:
          updated.name = userText;
          setMessages((prev) => [...prev, { sender: "bot", text: "Nice! What industry is it in?" }]);
          break;
        case 1:
          updated.industry = userText;
          setMessages((prev) => [...prev, { sender: "bot", text: "What style do you prefer? (e.g., minimalist, futuristic, luxury...)" }]);
          break;
        case 2:
          updated.style = userText;
          setMessages((prev) => [...prev, { sender: "bot", text: "Great. Any specific icons or imagery you’d like in it?" }]);
          break;
        case 3:
          updated.icon = userText;
          const prompt = `Logo design for a brand called ${updated.name} in the ${updated.industry} industry. Style is ${updated.style}. Include ${updated.icon}. Use clean vector illustration, dark background, centered layout.`;
          setMessages((prev) => [...prev, { sender: "bot", text: "Generating your logo now..." }]);

          try {
            const logoRes = await fetch("http://localhost:3001/generate-logo", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ prompt }),
            });
            const data = await logoRes.json();
            if (data.image) {
              const imageTag = `<img src='${data.image}' alt='Generated Logo' style='max-width:100%; border-radius:12px;'>`;
              setMessages((prev) => [...prev, { sender: "bot", text: "Here’s your generated logo:" }]);
              forceCanvasUpdate(imageTag);
            } else {
              throw new Error("No image returned");
            }
          } catch (err) {
            console.error("Logo generation failed:", err);
            setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ Logo generation failed." }]);
          }
          updated = { active: false, step: 0, name: "", industry: "", style: "", icon: "" };
          break;
        default:
          break;
      }
      updated.step++;
      setLogoWizard(updated);
      return;
    }

    if (
      userText.toLowerCase().includes("create logo") ||
      userText.toLowerCase().includes("generate logo") ||
      userText.toLowerCase().includes("design logo") ||
      userText.toLowerCase().includes("logo with options")
    ) {
      setLogoWizard({ active: true, step: 0, name: "", industry: "", style: "", icon: "" });
      setMessages((prev) => [...prev, { sender: "bot", text: "Let’s design your logo together. What’s your business name?" }]);
      return;
    }

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are FoundryBot, the world’s best AI startup cofounder.

Speak like a real cofounder: direct, sharp, focused.

🧠 Always do the work with the user, not just talk about it.
🪜 Only ask one clear question at a time.
⚠️ Never suggest hiring help unless asked.
✅ If the user says "create logo", go straight to designing. Don’t ask validation questions.
🎯 Stay on task — you're here to BUILD, not chit-chat.`
            },
            ...newMessages.map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
            })),
          ],
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      console.log("OpenAI raw response:", data);

      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error(data.error?.message || "No response from OpenAI");
      }

      const reply = data.choices[0].message.content.trim();
      const visualMatch = reply.match(/<img.*?>|<svg[\s\S]*?<\/svg>/);
      const visualOnly = visualMatch ? visualMatch[0] : "";
      const cleanText = reply.replace(visualOnly, "").replace(/```html|```/g, "").trim();

      if (cleanText) {
        setMessages((prev) => [...prev, { sender: "bot", text: cleanText }]);
      }
      if (visualOnly) {
        forceCanvasUpdate(visualOnly);
      }
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
                <strong>{msg.sender}:</strong> <span dangerouslySetInnerHTML={{ __html: msg.text }} />
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
            <span role="img" aria-label="brick">🧱</span> Canvas Output:
          </div>
          <div className="canvas-box">
            {botResponse ? (
              <div dangerouslySetInnerHTML={{ __html: botResponse }} />
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
