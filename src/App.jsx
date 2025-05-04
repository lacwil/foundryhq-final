import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const handleSend = () => {
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

    setMessages((prev) => [...prev, reply]);
    setInput('');
  };

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      style={{
        backgroundColor: '#f5f5f5',
        fontFamily: 'system-ui, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px 16px',
      }}
    >
      <div style={{ maxWidth: '700px', width: '100%' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>FoundryBot</h1>

        <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
          <li><a href="#" style={{ color: '#007bff' }}>New Chat</a></li>
          <li><a href="#" style={{ color: '#007bff' }}>Saved Prompts</a></li>
          <li><a href="#" style={{ color: '#007bff' }}>Settings</a></li>
        </ul>

        {/* Chat window */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #ddd',
            padding: '16px',
            height: '400px',
            overflowY: 'auto',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#f0f0f0',
                borderRadius: '12px',
                padding: '12px 16px',
                whiteSpace: 'pre-line',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                maxWidth: '100%',
              }}
            >
              {msg}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />
          <button
            onClick={handleSend}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              backgroundColor: '#000',
              color: '#fff',
              fontWeight: '600',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
