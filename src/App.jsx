import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const lower = input.toLowerCase();
    let reply = '';

    if (lower.includes('fitness')) {
      reply =
        '🧠 A fitness app helps track activity, workouts, nutrition & goals.\n\nFeatures include:\n• Workout plans\n• Progress tracking\n• Goal setting\n• Calories/macros\n• Videos & challenges\n\nTop apps:\n- MyFitnessPal\n- Nike Training Club\n- Fitbit\n- Strava';
    } else if (lower.includes('tshirt') || lower.includes('t-shirt')) {
      reply =
        '👕 Funny t-shirt websites:\n1. Snorg Tees – witty/humorous\n2. Busted Tees – quirky pop culture\n3. Threadless – artist-submitted\n4. The Chivery – irreverent memes\n5. Look Human – puns/unique\n6. 6 Dollar Shirts – budget humor\n7. TeeFury – limited edition\n8. Redbubble – global artists';
    } else {
      reply = "🤖 Sorry, I don't have a response for that topic yet.";
    }

    setMessages((prev) => [...prev, '🧠 FoundryBot is typing...']);
    setIsTyping(true);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [...prev.slice(0, -1), reply]);
      setIsTyping(false);
    }, 1200);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Sidebar Chat */}
      <div
        style={{
          width: '360px',
          borderRight: '1px solid #ddd',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>FoundryBot</h2>

        <div
          style={{
            flexGrow: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            paddingRight: '4px',
            marginBottom: '12px',
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: msg.includes('typing...') ? '#e0e0e0' : '#fff',
                padding: '12px',
                borderRadius: '10px',
                whiteSpace: 'pre-line',
                fontSize: '14px',
                lineHeight: '1.5',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                fontStyle: msg.includes('typing...') ? 'italic' : 'normal',
              }}
            >
              {msg}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input with Enter / Shift+Enter */}
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

      {/* Main Canvas Area */}
      <div
        style={{
          flexGrow: 1,
          backgroundColor: '#fff',
          padding: '40px',
          overflowY: 'auto',
        }}
      >
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
          Canvas Area
        </h1>
        <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#444' }}>
          This is your interactive canvas. The chat stays active on the left while this area can display tools, forms, content, code previews or AI results.
        </p>
      </div>
    </div>
  );
}

export default App;
