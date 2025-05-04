import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = () => {
    const lower = input.toLowerCase();

    if (lower.includes('fitness')) {
      setResponse(
        '🧠 A fitness app helps track activity, workouts, nutrition & goals.\n\nFeatures include:\n• Workout plans\n• Progress tracking\n• Goal setting\n• Calories/macros\n• Videos & challenges\n\nTop apps:\n- MyFitnessPal\n- Nike Training Club\n- Fitbit\n- Strava'
      );
    } else if (lower.includes('tshirt') || lower.includes('t-shirt')) {
      setResponse(
        '👕 Funny t-shirt websites:\n1. Snorg Tees – witty/humorous\n2. Busted Tees – quirky pop culture\n3. Threadless – artist-submitted\n4. The Chivery – irreverent memes\n5. Look Human – puns/unique\n6. 6 Dollar Shirts – budget humor\n7. TeeFury – limited edition\n8. Redbubble – global artists'
      );
    } else {
      setResponse("🤖 Sorry, I don't have a response for that topic yet.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#f5f5f5',
        fontFamily: 'system-ui, sans-serif',
        minHeight: '100vh',
        padding: '30px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ maxWidth: '680px', width: '100%' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>FoundryBot</h1>

        <ul style={{ marginBottom: '24px', paddingLeft: '20px' }}>
          <li><a href="#" style={{ color: '#007bff' }}>New Chat</a></li>
          <li><a href="#" style={{ color: '#007bff' }}>Saved Prompts</a></li>
          <li><a href="#" style={{ color: '#007bff' }}>Settings</a></li>
        </ul>

        <div style={{ fontWeight: '600', marginBottom: '12px' }}>AI Response:</div>

        {response && (
          <div
