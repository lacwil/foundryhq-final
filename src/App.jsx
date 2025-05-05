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

export default App;
