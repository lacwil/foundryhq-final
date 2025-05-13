import React, { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>{showLogin ? 'Login' : 'Register'}</h1>

      {showLogin ? <LoginForm /> : <RegistrationForm />}

      <button
        onClick={() => setShowLogin(!showLogin)}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        {showLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>
    </div>
  );
}

export default App;
