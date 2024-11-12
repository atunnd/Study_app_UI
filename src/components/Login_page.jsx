import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home_page from './home_page';

const Login_page = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username && password) {
      alert(`Username: ${username}\nPassword: ${password}`);
    } else {
      alert('Please enter both username and password');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5%' }}>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            style={{ margin: '10px', padding: '10px', fontSize: '1rem' }}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            style={{ margin: '10px', padding: '10px', fontSize: '1rem' }}
          />
        </label>
        <button type="submit" style={{ padding: '10px 20px', fontSize: '1rem', cursor: 'pointer' }}>
          Login
        </button>
      </form>
      <button onClick={() => alert('React Synthetic Event Triggered!')} style={{ marginTop: '10px' }}>
        Click Me
      </button>
      <Link to="/">Go to Home Page</Link>
    </div>
  );
};

export default Login_page;
