import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp_page.css'; 
import axios from 'axios';

const SignUp_page = () => {
  document.title = 'Study With Me';
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); 

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

  const axiosInstance = axios.create({
    baseURL: 'https://study-app-be-2.onrender.com', // Adjust the base URL as per your API setup
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const usernameString = String(username);
    const emailString = String(email);
    const passwordString = String(password);
  
    try {
      const response = await axiosInstance.post('/auth/register', 
      {
        name: usernameString,
        mail: emailString,
        password: passwordString
      });

      if (response.status === 200) {
        alert('Account created successfully!');
        navigate('/'); 
      } else {
        alert('Sign-up failed. Please try again.');
      }
    } catch (error) {
      console.error("Sign-up error:", error);
  
      if (error.response) {
        alert(error.response.data.detail || 'An error occurred during sign-up.');
      } else if (error.request) {
        alert('No response from the server. Please try again later.');
      } else {
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
              className="input-field-username"
            />
        </label>
        {/* email field*/}
        <label className="input-label">Email:
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className="input-field-email"
          />
        </label>
        {/* password field*/}
        <label className="input-label">Password:
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            className="input-field-password"
          />
        </label>
        {/* confirm password field*/}
        <label className="input-label">Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm your password"
            className="input-field-password-again"
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
