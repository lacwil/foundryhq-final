import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = () => {
    const lower = input.toLowerCase();

    if (lower.includes('fitness')) {
      setResponse(
        'A fitness app is a mobile application designed to help individuals track and manage their physical activity, exercise routines, nutrition, and overall wellness goals. These apps often provide features such as workout planning, progress tracking, goal setting, calorie tracking, and community support. Users can access exercise videos, workout plans, and challenges to stay motivated and reach their fitness goals. Popular fitness apps include MyFitnessPal, Nike Training Club, Fitbit, and Strava.'
      );
    } else if (lower.includes('tshirt') || lower.includes('t-shirt')) {
      setResponse(
        'Here are some funny t-shirt websites:\n1. Snorg Tees – witty and humorous designs.\n2. Busted Tees – quirky pop culture designs.\n3. Threadless – artist-submitted creative shirts.\n4. The Chivery – irreverent internet memes.\n5. Look Human – puns and unique designs.\n6. 6 Dollar Shirts – budget humor shirts.\n7. TeeFury – limited edition mashups.\n8. Redbubble – global artist designs.'
      );
    } else {
      setResponse("Sorry, I don't have a response for that topic yet.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#f9f9f9',
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>FoundryBot</h1>

      <ul style={{ marginBottom: '20px' }}>
        <li><a href="#">New Chat</a></li>
        <li><a href="#">Saved Prompts</a></li>
        <li><a href="#">Settings</a></li>
      </ul>

      <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>AI Response:</div>

      <div
        style={{
          backgroundColor: '#ffffff',
          color: '#000000',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #ccc',
          maxWidth: '700px',
          whiteSpace: 'pre-line',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          lineHeight: '1.6',
          marginBottom: '30px',
        }}
      >
        {response}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type something..."
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid gray',
            width: '300px',
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: '10px 20px',
            borderRadius: '5px',
            backgroundColor: 'black',
            color: 'white',
            border: 'none',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
