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
    <div className="w-full min-h-screen bg-white px-6 py-8 text-gray-900 font-sans overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">FoundryBot</h1>

        <nav className="mb-6">
          <ul className="list-disc list-inside space-y-1">
            <li><a href="#" className="text-blue-600 hover:underline">New Chat</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Saved Prompts</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">Settings</a></li>
          </ul>
        </nav>

        <div className="text-lg font-semibold mb-2">AI Response:</div>

        <div className="w-full flex justify-start">
          <div
            className="bg-gray-100 p-4 rounded-md text-base text-gray-800 leading-relaxed"
            style={{
              maxWidth: '700px',
              whiteSpace: 'pre-wr
