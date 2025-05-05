// Plan:
// 1. Launch FoundryBot with multi-step funnel logic per project
// 2. Track each project's funnel stage in localStorage
// 3. Ask one question at a time until business is fully built

import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_PROJECT = 'Default Project';

function App() {
  const [input, setInput] = useState('');
  const [selectedProject, setSelectedProject] = useState(DEFAULT_PROJECT);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [canvasContent, setCanvasContent] = useState('');
  const chatEndRef = useRef(null);

  const getStorageKey = (project) => `foundry_chat_${project}`;
  const getStageKey = (project) => `foundry_stage_${project}`;

  const getSavedProjects = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('foundry_chat_'));
    const base = keys.map(k => k.replace('foundry_chat_', ''));
    return [...new Set([DEFAULT_PROJECT, ...base])];
  };

  const getStage = () => localStorage.getItem(getStageKey(selectedProject)) || 'ask_business_type';
  const setStage = (stage) => localStorage.setItem(getStageKey(selectedProject), stage);

  const loadMessages = (project) => {
    const saved = localStorage.getItem(getStorageKey(project));
    return saved ? JSON.parse(saved) : [];
  };

  const saveMessages = (msgs) => {
    setMessages(msgs);
    localStorage.setItem(getStorageKey(selectedProject), JSON.stringify(msgs));
  };

  useEffect(() => {
    setProjects(getSavedProjects());
    const msgs = loadMessages(selectedProject);
    setMessages(msgs);
    const lastBotMsg = [...msgs].reverse().find(m => m.sender === 'bot' && m.canvas);
    if (lastBotMsg) setCanvasContent(lastBotMsg.canvas);

    if (msgs.length === 0) {
      const firstPrompt = funnelPrompt('ask_business_type', '');
      const botMsg = { sender: 'bot', text: firstPrompt };
      const initialMessages = [botMsg];
      saveMessages(initialMessages);
    }
  }, [selectedProject]);

  const funnelPrompt = (stage, userInput) => {
    switch (stage) {
      case 'ask_business_type':
        setStage('refine_goal');
        return `What is your newest empire going to be?`;
      case 'refine_goal':
        setStage('research_niche');
        return `What does success look like for this empire?`;
      case 'research_niche':
        setStage('build_plan');
        return `Would you like help identifying trending niches or high-profit opportunities for this business?`;
      case 'build_plan':
        setStage('generate_name');
        return `Shall I generate a simple business plan with steps to launch?`;
      case 'generate_name':
        setStage('check_domain');
        return `Which of these names do you like best, or do you have one already?`;
      case 'check_domain':
        setStage('design_logo');
        return `Shall we check if your preferred domain is available and suggest alternatives?`;
      case 'design_logo':
        setStage('build_website');
        return `What logo style fits your brand best — clean, bold, minimalist, playful, or luxury?`;
      case 'build_website':
        setStage('launch_ready');
        return `Want to preview the homepage live or edit it first?`;
      case 'launch_ready':
        setStage('ai_marketing');
        return `Ready to launch this business? I can walk you through domain, Stripe, email, hosting setup.`;
      case 'ai_marketing':
        return `Let’s generate a Facebook ad, email welcome flow, and influencer outreach for your brand.`;
      default:
        return `The user said: "${userInput}". Continue guiding them through building: "${selectedProject}".`;
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { sender: 'user', text: trimmed };
    const typingMsg = { sender: 'bot', text: 'FoundryBot is typing...' };
    const updated = [...messages, userMessage, typingMsg];
    saveMessages(updated);
    setInput('');
    setIsTyping(true);

    try {
      const stage = getStage();
      const stagePrompt = funnelPrompt(stage, trimmed);

      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: stagePrompt })
      });

      const data = await response.json();
      const reply = data.reply || "🧠 Couldn't generate a response.";
      const canvas = data.canvas || '';

      const botReply = { sender: 'bot', text: reply };
      if (canvas) {
        botReply.canvas = canvas;
        setCanvasContent(canvas);
      }

      const updatedWithReply = [...updated.slice(0, -1), botReply];
      saveMessages(updatedWithReply);
    } catch (err) {
      const errorReply = { sender: 'bot', text: '❌ Failed to fetch AI response.' };
      const updatedWithError = [...updated.slice(0, -1), errorReply];
      saveMessages(updatedWithError);
    }

    setIsTyping(false);
  };

  const createNewProject = () => {
    const name = prompt('Enter new project name:');
    if (!name) return;
    if (projects.includes(name)) return alert('Project already exists.');
    setProjects([...projects, name]);
    setSelectedProject(name);
    localStorage.setItem(getStorageKey(name), JSON.stringify([]));
    localStorage.setItem(getStageKey(name), 'ask_business_type');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '360px', borderRight: '1px solid #ddd', background: '#f9f9f9', padding: 20, display: 'flex', flexDirection: 'column' }}>
        <h2>FoundryBot</h2>

        <div style={{ display: 'flex', marginBottom: 10, gap: 8 }}>
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} style={{ flex: 1, padding: '6px' }}>
            {projects.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <button onClick={createNewProject} style={{ padding: '6px 10px' }}>＋</button>
        </div>

        <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: 10 }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: msg.sender === 'user' ? '#d9fdd3' : '#fff',
                padding: 10,
                borderRadius: 8,
                marginBottom: 6,
                whiteSpace: 'pre-line'
              }}
            >
              <strong>{msg.sender === 'user' ? 'You' : '🧠 FoundryBot'}:</strong> {msg.text}
            </div>
          ))}
          {isTyping && <div style={{ fontStyle: 'italic' }}>FoundryBot is typing...</div>}
          <div ref={chatEndRef} />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message..."
            rows={2}
            style={{ flex: 1, resize: 'none', padding: 10 }}
          />
          <button onClick={handleSend} style={{ padding: '10px 16px', background: '#000', color: '#fff' }}>Send</button>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ flexGrow: 1, padding: 40 }}>
        <h1>Canvas Area</h1>
        <p>This is your interactive project area for: <strong>{selectedProject}</strong></p>
        <div
          style={{
            marginTop: 20,
            padding: 20,
            border: '1px solid #ddd',
            borderRadius: 8,
            background: '#fff'
          }}
          dangerouslySetInnerHTML={{ __html: canvasContent }}
        />
      </div>
    </div>
  );
}

export default App;
