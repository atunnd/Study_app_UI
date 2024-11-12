import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login_page.css';

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
    <div className="login-container">
      <h1 className="login-title">Login Page</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <label className="login-label">
          Username:
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className="login-input"
          />
        </label>
        <label className="login-label">
          Password: 
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
        <button type="submit" className="login-button">
          Login
        </button>
        <Link to="" className="link-to-sign-up">
          Create account
        </Link>
      </form>
      <Link to="/" className="home-link">
        Go to Home Page
      </Link>
    </div>
  );
};

export default Login_page;
