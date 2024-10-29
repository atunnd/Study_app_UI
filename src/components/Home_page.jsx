import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Home_page.css';

const Home_page = () => {
  const navigate = useNavigate();
  const handleClick = (event) => {
      navigate("/login_page");
  }
  return (
    
    <div className="container">
      {/* falling leaves: https://codepen.io/uurrnn/pen/WNLVdN */}
      <div id="leaves">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
      </div>
      {/* Header Section */}
      <header className="header">
        <h1 className="header_title">Study with me</h1>
      </header>

      {/* Main Content Section*/}
      <main className="button_container">
        <button className="login_button" onClick={handleClick}>login</button>
        <button className="sign_up_button" onClick={handleClick}>sign up</button>
        <button className="about_us_button" onClick={handleClick}>about us</button>
      </main>

      
      {/* Footer Section */}
      <footer className="footer">
        <p className="footer-text"></p>
      </footer>
    </div>
  )
}

export default Home_page;
