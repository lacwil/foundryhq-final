import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('foundry_chat');
    return saved ? JSON.parse(saved) : [];
  });
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const saveMessages = (updatedMessages) => {
    setMessages(updatedMessages);
    localStorage.setItem('foundry_chat', JSON.stringify(updatedMessages));
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { sender: 'user', text: trimmed };
    const typingMsg = { sender: 'bot', text: 'FoundryBot is typing...' };

    const updated = [...messages, userMessage, typingMsg];
    saveMessages(updated);
    setInput('');
    setIsTyping(true);

    const lower = trimmed.toLowerCase();
    let reply = '';

    if (lower.includes('fitness')) {
      reply =
        '🏋️‍♂️ A fitness app helps track workouts, nutrition, and goals. Popular apps include:\n- MyFitnessPal\n- Nike Training Club\n- Strava\n- Fitbit.';
    } else if (lower.includes('tshirt') || lower.includes('t-shirt')) {
      reply =
        '👕 Funny t-shirt websites:\n1. Snorg Tees\n2. Busted Tees\n3. Threadless\n4. The Chivery\n5. Look Human\n6. 6 Dollar Shirts\n7. TeeFury\n8. Redbubble';
    } else {
      reply = "🤖 Sorry, I don't have a response for that topic yet.";
    }

    setTimeout(() => {
      const updatedWithReply = [...updated.slice(0, -1), { sender: 'bot', text: reply }];
      saveMessages(updatedWithReply);
      setIsTyping(false);
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Chat Sidebar */}
      <div style={{ width: '360px', borderRight: '1px solid #ddd', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>FoundryBot</h2>

        <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px', marginBottom: '12px' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: msg.sender === 'bot' ? '#fff' : '#d9fdd3',
                padding: '12px',
                borderRadius: '10px',
                whiteSpace: 'pre-line',
                fontSize: '14px',
                lineHeight: '1.5',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '90%',
              }}
            >
              <strong>{msg.sender === 'user' ? 'You' : '🤖 FoundryBot'}:</strong> {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: '8px' }}>
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
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '14px',
              resize: 'none',
            }}
          />
          <button
            onClick={handleSend}
            type="button"
            style={{
              backgroundColor: '#000',
              color: '#fff',
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div style={{ flexGrow: 1, backgroundColor: '#fff', padding: '40px', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Canvas Area</h1>
        <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#444' }}>
          This is your interactive canvas. The chat stays active on the left while this area can display tools, forms, content, code previews or AI results.
        </p>
      </div>
    </div>
  );
}

export default App;
