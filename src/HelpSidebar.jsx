import React, { useState } from 'react';

const HelpSidebar = () => {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen(!open);

  return (
    <>
      <button
        onClick={toggleSidebar}
        style={{
          position: 'absolute',
          top: 20,
          right: open ? 260 : 20,
          zIndex: 1000,
          padding: '8px 12px',
          borderRadius: '4px',
          backgroundColor: '#444',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {open ? '❌ Close Help' : '📘 Help'}
      </button>

      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: open ? '250px' : '0px',
          height: '100%',
          overflowX: 'hidden',
          transition: 'width 0.3s ease-in-out',
          backgroundColor: '#f9f9f9',
          borderLeft: '1px solid #ccc',
          padding: open ? '20px' : '0',
          boxShadow: open ? '-2px 0 6px rgba(0,0,0,0.1)' : 'none',
          zIndex: 999
        }}
      >
        {open && (
          <div style={{ overflowY: 'auto', height: '100%', fontSize: '14px' }}>
            <h3>📘 Help & Features</h3>
            <h4>🧱 Core Purpose</h4>
            <p>
              FoundryBot is your AI assistant for building React apps. It generates, saves, and renders code live based on your instructions.
            </p>

            <h4>✅ Current Features</h4>
            <ul>
              <li>ChatGPT-style conversation</li>
              <li>Canvas drawing with toolbar</li>
              <li>Live JSX file generation</li>
              <li>Auto component rendering</li>
            </ul>

            <h4>🛠️ In Progress</h4>
            <ul>
              <li>Edit existing files like App.jsx</li>
              <li>Deploy to Vercel/GitHub</li>
              <li>Empire funnel interaction</li>
            </ul>

            <h4>🔐 API Keys</h4>
            <ul>
              <li>VITE_OPENAI_API_KEY (frontend)</li>
              <li>OPENAI_API_KEY (backend)</li>
            </ul>

            <h4>🚀 Future Plans</h4>
            <ul>
              <li>Memory reset button</li>
              <li>Generate deployable zip</li>
              <li>GitHub commit sync</li>
              <li>Dynamic theme editing</li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default HelpSidebar;
