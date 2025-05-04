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
    } else
