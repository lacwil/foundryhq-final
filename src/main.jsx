import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        display: 'block',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <App />
    </div>
  </React.StrictMode>
);
