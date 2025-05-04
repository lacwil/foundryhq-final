import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = () => {
    const lower = input.toLowerCase();

    if (lower.includes('fitness')) {
      setResponse(
        'A fitness app is a mobile application designed to help individuals track and manage their physical activity, exercise routines, nutrition, and overall wellness goals.\n\nThese apps often provide features such as:\n- Workout planning\n- Progress tracking\n- Goal setting\n- Calorie tracking\n- Community support\n\nPopular fitness apps include:\n• MyFitnessPal\n• Nike Training Club\n• Fitbit\n• Strava'
      );
    } else if (lower.includes('tshirt') || lower.includes('t-shirt')) {
      setResponse(
        'Here are some funny t-shirt websites:\n\n1. Snorg Tees – witty and humorous designs\n2. Busted Tees – quirky pop culture shirts\n3. Threadless – artist-submitted designs\n4. The Chivery – irreverent internet memes\n5. Look Human – puns and unique ideas\n6. 6 Dollar Shirts – budget humor shirts\n7. TeeFury – limited edition mashups\n8. Redbubble – global artist content'
      );
    } else {
      setResponse("Sorry, I don't have a response for that topic yet.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#f0f0f0',
        fontFamily: 'system-ui, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '700px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>FoundryBot</h1>

        <ul style={{ marginBottom: '24px', paddingLeft: '20px' }}>
          <li><a href="#" style={{ color: '#007bff' }}>New Chat</a></li>
          <li><a href="#" style={{ color: '#007bff' }}>Saved Prompts</a></li>
          <li><a href="#" style={{ color: '#007bff' }}>Settings</a></li>
        </ul>

        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>AI Response:</div>

        <div
          style={{
            backgroundColor: '#ffffff',
            color: '#000000',
            padding: '18px 20px',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
