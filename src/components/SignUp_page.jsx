import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp_page.css'; // Make sure you add a CSS file for styling

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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Handle form submission, e.g., send data to an API
    alert(`Signed up with Username: ${username}, Email: ${email}`);
    navigate('/'); // Redirect to the login page after successful sign-up
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
