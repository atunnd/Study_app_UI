import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login_page.css';
import axios from 'axios';

const Login_page = () => {
  const [usermail, setUsermail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleUsermailChange = (event) => {
    setUsermail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
 
    if (usermail && password) {
        const emailString = String(usermail);
        const passwordString = String(password);
        const nameString = "user";
      try {
        const response = await axios.post('http://localhost:8000/log_in', {
          name: nameString,
          mail: emailString,
          password: passwordString
        });
 
        if (response.status === 200) {
          alert('Login successful!');
          localStorage.setItem('user_id', response.data.user_id);
          navigate('/Study_page'); // Redirect to the study page
        }
      } catch (error) {
        console.error('Login failed:', error);
        alert(error.response?.data?.detail || 'Invalid login credentials.');
        const loginData = {
          name: nameString,
          mail: emailString,
          password: passwordString
        };
        
        // Log to the console
        console.log(loginData);
        
        // Alert the object as a string
        alert(JSON.stringify(loginData, null, 2));
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
        <label className="login-label">Email:
          <input
            className="login-input"
            type="email"
            value={usermail}
            onChange={handleUsermailChange}
            placeholder='Enter your email'
          />
        </label>
        {/* password field */}
        <label className="login-label">Password: 
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder='Enter your password'
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
