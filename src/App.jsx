import React, { useRef, useState, useEffect } from 'react';
import { FaTrash, FaPaintBrush, FaPalette } from 'react-icons/fa';

const DEFAULT_PROJECT = 'Default Project';

function App() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);
  const [selectedProject, setSelectedProject] = useState(DEFAULT_PROJECT);
  const [projects, setProjects] = useState([DEFAULT_PROJECT]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctxRef.current = ctx;
  }, [brushColor, brushSize]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setTimeout(() => {
      const botMsg = {
        sender: 'bot',
        text: `🧠 FoundryBot: You said "${input}". Let's build on that.`
      };
      setMessages(prev => [...prev, botMsg]);
    }, 500);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '10px', display: 'flex', flexDirection: 'column' }}>
        <h2>FoundryBot</h2>
        <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
          {projects.map((proj, idx) => (
            <option key={idx}>{proj}</option>
          ))}
        </select>
        <button onClick={() => setMessages([])}>+ New Project</button>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ background: msg.sender === 'bot' ? '#e0e0ff' : '#d0ffd0', margin: '5px', padding: '8px', borderRadius: '5px' }}>
              {msg.sender === 'bot' ? msg.text : `You: ${msg.text}`}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '5px' }}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} style={{ flex: 1 }} placeholder="Type your message..." />
          <button type="submit">Send</button>
        </form>
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          onMouseLeave={finishDrawing}
        />

        <div style={{
          position: 'absolute',
          bottom: '30px',
          right: '30px',
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: '#ffffff',
          boxShadow: '0 0 12px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          padding: '10px'
        }}>
          <button
            onClick={clearCanvas}
            title="Clear Canvas"
            style={{
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <FaTrash />
          </button>

          <label title="Brush Color">
            <FaPalette style={{ fontSize: '18px', marginBottom: '4px' }} />
            <input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              style={{
                width: '40px',
                height: '40px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}
            />
          </label>

          <label title="Brush Size" style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <FaPaintBrush style={{ fontSize: '18px' }} />
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              style={{ width: '60px' }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;
