import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = () => {
    // Temporary mock AI reply
    setResponse(
      'A fitness app is a mobile application designed to help individuals track and manage their physical activity, exercise routines, nutrition, and overall wellness goals. These apps often provide features such as workout planning, progress tracking, goal setting, calorie tracking, and community support. Users can access exercise videos, workout plans, and challenges to stay motivated and reach their fitness goals. Popular fitness apps include MyFitnessPal, Nike Training Club, Fitbit, and Strava.'
    );
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">FoundryBot</h1>

      <nav className="mb-6">
        <ul className="list-disc list-inside space-y-1">
          <li><a href="#" className="text-blue-600 hover:underline">New Chat</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">Saved Prompts</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">Settings</a></li>
        </ul>
      </nav>

      <div className="font-semibold mb-2 text-lg">AI Response:</div>

      <div className="whitespace-pre-wrap break-words w-full max-w-4xl text-base leading-relaxed bg-gray-100 p-4 rounded-md mb-6">
        {response}
      </div>

      <div className="flex items-center space-x-2">
        <input
