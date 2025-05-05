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
      saveMessages([botMsg]);
    }
  }, [selectedProject]);

  const funnelPrompt = (stage, userInput) => {
    switch (stage) {
      case 'ask_business_type':
        setStage('refine_goal');
        return `What is your newest empire going to be?`;

      case 'refine_goal':
        setStage('research_niche');
        return `The user wants to start: "${userInput}". Ask: What does success look like to you for this business idea? Focus on real-world business goals like revenue, freedom, impact, etc.`;

      case 'research_niche':
        setStage('build_plan');
        return `The business idea is: "${userInput}". Ask: Would you like help identifying trending niches, suppliers, or best-selling products in this space?`;

      case 'build_plan':
        setStage('generate_name');
        return `The business context is: "${userInput}". Ask: Shall I help generate a simple business plan with goals, steps, and monetization ideas?`;

      case 'generate_name':
        setStage('check_domain');
        return `Let’s brainstorm brand names for: "${userInput}". Suggest 3–5 and ask the user to pick one or modify.`;

      case 'check_domain':
        setStage('design_logo');
        return `Check if "${userInput}" is available as a domain. Suggest .coms and close alternatives.`;

      case 'design_logo':
        setStage('build_website');
        return `For the brand "${userInput}", suggest 2–3 logo styles (modern, luxury, bold, minimalist). Ask which one they prefer.`;

      case 'build_website':
        setStage('launch_ready');
        return `Let’s draft a homepage layout for "${userInput}". Ask: Would you like to preview or tweak it first?`;

      case 'launch_ready':
        setStage('ai_marketing');
        return `Confirm launch checklist for "${userInput}": domain, hosting, email, Stripe, suppliers. Ask: Ready to go live?`;

      case 'ai_marketing':
        return `Now that "${userInput}" is live, let’s generate a Facebook ad, welcome email, and launch post to promote it.`;

      default:
        return `The user said: "${userInput}". Continue guiding them through building: "${selectedProject}".`;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    const newMessages = [...messages, userMsg];
    saveMessages(newMessages);
    setInput('');
    setIsTyping(true);

    const stage = getStage();
    const nextPrompt = funnelPrompt(stage, input);

    const botMsg = { sender: 'bot', text: nextPrompt, canvas: `<div><strong>🧠 AI Suggestion:</strong><br/>${nextPrompt}</div>` };
    const updatedMessages = [...newMessages, botMsg];
    saveMessages(updatedMessages);
    setCanvasContent(botMsg.canvas);
    setIsTyping(false);
  };

  const handleProjectChange = (e) => {
    const proj = e.target.value;
    setSelectedProject(proj);
  };

  const handleNewProject = () => {
    const name = prompt('Enter new project name:');
    if (name && !projects.includes(name)) {
      const newList = [...projects, name];
      setProjects(newList);
      setSelectedProject(name);
      localStorage.setItem(getStorageKey(name), JSON.stringify([]));
      localStorage.setItem(getStageKey(name), 'ask_business_type');
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ width: '30%', padding: '1rem', borderRight: '1px solid #ccc' }}>
        <h2>FoundryBot</h2>
        <div>
          <select value={selectedProject} onChange={handleProjectChange}>
            {projects.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <button onClick={handleNewProject} style={{ marginLeft: '8px' }}>+</button>
        </div>
        <div style={{ marginTop: '1rem', overflowY: 'auto', height: '75vh' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ background: m.sender === 'user' ? '#d3f9d8' : '#f0f0f0', padding: '0.5rem', margin: '0.5rem 0' }}>
              <strong>{m.sender === 'user' ? 'You' : '🤖 FoundryBot'}:</strong> {m.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div style={{ display: 'flex', marginTop: '1rem' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1, padding: '0.5rem' }}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} style={{ padding: '0.5rem' }}>Send</button>
        </div>
      </div>
      <div style={{ width: '70%', padding: '1rem' }}>
        <h2>Canvas Area</h2>
        <p>This is your interactive project area for: <strong>{selectedProject}</strong></p>
        <div dangerouslySetInnerHTML={{ __html: canvasContent }} />
      </div>
    </div>
  );
}

export default App;
