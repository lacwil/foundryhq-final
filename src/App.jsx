import React, { useState, useEffect, useRef } from 'react';
import CanvasDraw from "react-canvas-draw";

const DEFAULT_PROJECT = 'Default Project';

function App() {
  const [input, setInput] = useState('');
  const [selectedProject, setSelectedProject] = useState(DEFAULT_PROJECT);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [canvasContent, setCanvasContent] = useState('');
  const chatEndRef = useRef(null);
  const canvasRef = useRef(null);

  const getStorageKey = (project) => `foundry_chat_${project}`;
  const getSavedProjects = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('foundry_chat_'));
    return [...new Set([DEFAULT_PROJECT, ...keys.map(k => k.replace('foundry_chat_', ''))])];
  };

  const loadMessages = (project) => {
    const saved = localStorage.getItem(getStorageKey(project));
    return saved ? JSON.parse(saved) : [];
  };

  const saveMessages = (msgs) => {
    setMessages(msgs);
    localStorage.setItem(getStorageKey(selectedProject), JSON.stringify(msgs));
  };

  const resetProject = () => {
    localStorage.removeItem(getStorageKey(selectedProject));
    const botMsg = { sender: 'bot', text: `🧠 FoundryBot: What is your newest empire going to be?` };
    const initialMessages = [botMsg];
    saveMessages(initialMessages);
    setCanvasContent('');
  };

  const funnelQuestions = [
    'Who is your target audience?',
    'What makes your idea unique or different?',
    'Would you prefer a website, an app, or both?',
    'What brand tone do you want — fun, bold, professional, luxury, etc.?',
    'Do you want help with naming your business?',
    'Would you like me to check domain name availability?',
    'Would you like help designing a logo?',
    'Do you want help with marketing strategies?',
    'Do you want help with tech setup (email, payments, etc.)?',
    'Do you want a lightweight startup kit or a full build with automation and AI features?',
    'Would you like to begin setting up your domain and hosting?'
  ];

  const getNextStagePrompt = (messages) => {
    const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
    const lastBotQuestion = [...messages].reverse().find(m => m.sender === 'bot' && funnelQuestions.some(q => m.text.includes(q)));
    const answered = lastBotQuestion && lastUserMsg && messages.indexOf(lastUserMsg) > messages.indexOf(lastBotQuestion)
      ? funnelQuestions.findIndex(q => lastBotQuestion.text.includes(q)) + 1
      : funnelQuestions.findIndex(q => lastBotQuestion?.text.includes(q));
    return funnelQuestions[answered] || null;
  };

  useEffect(() => {
    setProjects(getSavedProjects());
    const msgs = loadMessages(selectedProject);
    setMessages(msgs);
    const lastBotMsg = [...msgs].reverse().find(m => m.sender === 'bot' && m.canvas);
    if (lastBotMsg) setCanvasContent(lastBotMsg.canvas);
    if (msgs.length === 0) {
      const botMsg = { sender: 'bot', text: `🧠 FoundryBot: What is your newest empire going to be?` };
      saveMessages([botMsg]);
    }
  }, [selectedProject]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="app" style={{ display: 'flex', height: '100vh' }}>
      <div className="sidebar" style={{ width: '300px', overflow: 'auto', borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
        <h2>FoundryBot</h2>
        <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
          {projects.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <button onClick={resetProject}>+ New Project</button>
        <div className="chat-box" style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sender}`}>{msg.sender === 'user' ? `You: ${msg.text}` : msg.text}</div>
          ))}
          {isTyping && <div className="message bot">🧠 FoundryBot is thinking…</div>}
          <div ref={chatEndRef} />
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!input.trim()) return;
            const newMessages = [...messages, { sender: 'user', text: input }];
            saveMessages(newMessages);
            setInput('');
            setIsTyping(true);
            const chatHistory = newMessages.map((m) => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text.replace('🧠 FoundryBot: ', '')
            }));
            try {
              const res = await fetch('http://localhost:3001/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: chatHistory })
              });
              const data = await res.json();
              const botText = `🧠 FoundryBot: ${data.reply}`;
              const botMsg = { sender: 'bot', text: botText, canvas: data.canvas };
              const finalMsgs = [...newMessages, botMsg];
              saveMessages(finalMsgs);
              setCanvasContent(data.canvas);

              const nextPrompt = getNextStagePrompt(finalMsgs);
              if (nextPrompt) {
                const nextMsg = { sender: 'bot', text: `🧠 FoundryBot: ${nextPrompt}` };
                saveMessages([...finalMsgs, nextMsg]);
              }
            } catch (err) {
              const errMsg = { sender: 'bot', text: `❌ Failed to fetch AI response.` };
              saveMessages([...newMessages, errMsg]);
            }
            setIsTyping(false);
          }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1 }}
          />
          <button type="submit">Send</button>
        </form>
      </div>
      <div className="canvas" style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <h1>Canvas Area</h1>
        <p>This is your interactive project area for: <strong>{selectedProject}</strong></p>
        <div className="canvas-content" style={{ marginBottom: '20px' }}>
          <strong>🧠 AI Suggestion:</strong>
          <div dangerouslySetInnerHTML={{ __html: canvasContent || 'No response yet.' }} />
        </div>
        <CanvasDraw
          ref={canvasRef}
          canvasWidth={800}
          canvasHeight={400}
          lazyRadius={1}
          brushRadius={2}
          hideGrid={true}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            background: '#f0f0f0',
            borderRadius: '10px',
            padding: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 10
          }}
        >
          <button onClick={() => canvasRef.current.undo()} style={{ padding: '6px 10px' }}>
            Undo
          </button>
          <button onClick={() => canvasRef.current.clear()} style={{ padding: '6px 10px' }}>
            Clear
          </button>
          <label style={{ fontSize: '14px' }}>
            🖌️
            <input
              type="range"
              min="1"
              max="10"
              defaultValue="2"
              onChange={(e) => (canvasRef.current.brushRadius = parseInt(e.target.value))}
              style={{ marginLeft: '5px' }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;
