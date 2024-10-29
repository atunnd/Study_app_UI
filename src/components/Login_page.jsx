import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home_page from './home_page';

const Login_page = () => {

  const handleClick = (event) => {
    if (event instanceof Event) {
      
    } else {
      alert('React Synthetic Event Triggered!');
    }
  }
  return (
    <div>
      <h1>This is the login page</h1>
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
};

export default Login_page;
