import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login_page.css';


const Login_page = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username && password) {
      {/*Check for correct account*/}
      if ((username == "atun") && (password == "123")) {
        alert("Welcome back! ", username)
        navigate("/Study_page")
      }
    } else {
      alert('Please enter both username and password');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login Page</h1>
      <form onSubmit={handleSubmit} className="login-form">
        {/* username field */}
        <label className="login-label">Username:
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className="login-input"
          />
        </label>
        {/* password field */}
        <label className="login-label">Password: 
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
        {/*submit button*/}
        <button type="submit" className="login-button">
          Login
        </button>
        {/*Link to home page and sign up page*/}
        <label className="link-container">
          <Link to="/SignUp_page" className="signup-link">
            Create account
          </Link>
          <Link to="/" className="home-link">
            Go to Home Page
          </Link>
        </label>       
      </form>     
    </div>
  );
};

export default Login_page;
