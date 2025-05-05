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
      const firstPrompt = `🧠 FoundryBot: What is your newest empire going to be?`;
      const botMsg = { sender: 'bot', text: firstPrompt };
      const initialMessages = [botMsg];
      setStage('ask_product_type');
      saveMessages(initialMessages);
    }
  }, [selectedProject]);

  const nextStage = (stage) => {
    const stages = [
      'ask_business_type',
      'ask_product_type',
      'ask_target_customer',
      'ask_supplier_help',
      'ask_platform',
      'ask_brand',
      'build_name',
      'next_steps'
    ];
    const index = stages.indexOf(stage);
    return index >= 0 && index < stages.length - 1 ? stages[index + 1] : 'done';
  };

  const generateFunnelPrompt = (stage, userInput, project) => {
    const storedInput = localStorage.getItem(`${getStageKey(selectedProject)}_last_input`) || userInput;

    switch (stage) {
      case 'ask_business_type':
        return `The user wants to start a new business empire called "${project}". Ask what kind of business this will be.`;
      case 'ask_product_type':
        return `The user said: "${storedInput}". Ask what products or services this business will offer.`;
      case 'ask_target_customer':
        return `The product/service is: "${storedInput}". Ask who the ideal customer is and what problem it solves.`;
      case 'ask_supplier_help':
        return `For "${storedInput}", ask if they’d like help finding suppliers, sourcing, or store tools.`;
      case 'ask_platform':
        return `Ask which platform they prefer to sell "${storedInput}" on: Shopify, Etsy, Amazon, etc.`;
      case 'ask_brand':
        return `The product is "${storedInput}". Ask what branding style they want: luxury, minimalist, modern, etc.`;
      case 'build_name':
        return `Let's create names for "${storedInput}". Suggest 3–5 business names they can pick or tweak.`;
      case 'next_steps':
        return `Based on "${storedInput}", summarize and ask if they're ready for logo, domain, and launch.`;
      case 'done':
        return `The user said: "${storedInput}". Ask if they want to review anything before launching.`;
      default:
        return `The user said: "${storedInput}". Let's keep building their empire.`;
    }
  };

  return (
    <div className="app">
      <div className="sidebar">
        <h2>FoundryBot</h2>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}>
          {projects.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <div className="chat-box">
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

            const currentStage = getStage();
            const next = nextStage(currentStage);
            localStorage.setItem(`${getStageKey(selectedProject)}_last_input`, input);
            const prompt = generateFunnelPrompt(currentStage, input, selectedProject);

            try {
              const res = await fetch('http://localhost:3001/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
              });
              const data = await res.json();
              const botText = `🧠 FoundryBot: ${data.response}`;
              const botMsg = { sender: 'bot', text: botText, canvas: data.response };
              saveMessages([...newMessages, botMsg]);
              setCanvasContent(data.response);
              setStage(next);
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
          />
          <button type="submit">Send</button>
        </form>
      </div>
      <div className="canvas">
        <h1>Canvas Area</h1>
        <p>This is your interactive project area for: <strong>{selectedProject}</strong></p>
        <div className="canvas-content">
          <strong>🧠 AI Suggestion:</strong>
          <p>{canvasContent || 'No response.'}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
