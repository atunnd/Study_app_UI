import React, { useContext, createContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login_page.css';
import axios from 'axios';
import useToken from '../hooks/useToken';

const Login_page = () => {
  document.title = 'Study With Me';

  const [usermail, setUsermail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { setToken } = useToken();


  const handleUsermailChange = (event) => {
    setUsermail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const axiosInstance = axios.create({
      baseURL: 'https://study-app-be-2.onrender.com', // Adjust the base URL as per your API setup
    });
 
    if (usermail && password) {
        const emailString = String(usermail);
        const passwordString = String(password);
        const nameString = "user";
      try {
        // const response = await axios.post('https://study-app-be-4.onrender.com/log_in', 
        const response = await axiosInstance.post('/auth/log_in', 
          
        {
          name: nameString,
          mail: emailString,
          password: passwordString
        });
 
        if (response.status === 200) {
          const userToken = { token: response.data.data.token };
          localStorage.setItem('user_id', response.data.data.user_id)
          localStorage.setItem('user_name', response.data.data.user_name)
          localStorage.setItem('mail', response.data.data.mail)
          setToken(userToken);
          navigate('/Study_page');
        }
      } catch (error) {
        console.error('Login failed:', error);
        alert(error.response?.data?.detail || 'Invalid login!');
        const loginData = {
          name: nameString,
          mail: emailString,
          password: passwordString
        };
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
