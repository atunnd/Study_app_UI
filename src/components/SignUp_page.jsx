import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp_page.css'; // Make sure you add a CSS file for styling
import axios from 'axios';

const SignUp_page = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); // to navigate after successful sign-up

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validate that passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const usernameString = String(username);
    const emailString = String(email);
    const passwordString = String(password);
  
    try {
      // Make the POST request to FastAPI backend
      const response = await axios.post('http://localhost:8000/create_user', {
        name: usernameString,
        mail: emailString,
        password: passwordString
      });

      
  
      // Check if the response status code is 200
      if (response.status === 200) {
        alert('Account created successfully!');
        navigate('/Study_page'); // Redirect to login page after successful sign-up
      } else {
        alert('Sign-up failed. Please try again.');
      }
    } catch (error) {
      console.error("Sign-up error:", error);
  
      // Enhanced error handling
      if (error.response) {
        // Error response from server
        alert(error.response.data.detail || 'An error occurred during sign-up.');
      } else if (error.request) {
        // Request made but no response received
        alert('No response from the server. Please try again later.');
      } else {
        // Something else went wrong
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };
  

  return (
    <div className="container">
      <h1 className="header_title">Create an Account</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        {/* username field*/}
        <label className="input-label">Username:
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter your username"
              className="input-field"
            />
        </label>
        {/* email field*/}
        <label className="input-label">Email:
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className="input-field"
          />
        </label>
        {/* password field*/}
        <label className="input-label">Password:
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            className="input-field"
          />
        </label>
        {/* confirm password field*/}
        <label className="input-label">Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm your password"
            className="input-field"
          />
        </label>
        <button type="submit" className="submit-button">Sign Up</button>
      </form>
      <p className="login-link">
        Already have an account? <a href="/login_page">Login</a>
      </p>
    </div>
  );
};

export default SignUp_page;
