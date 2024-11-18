import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Home_page.css';

const Home_page = () => {
  const navigate = useNavigate();
  const handleClickLogin = (event) => {
      navigate("/login_page");
  }
  const handleClickSignUp = (event) => {
    navigate("/SignUp_page");
  }
  const handleClickAboutUs = (event) => {
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
      </div>
      {/* Header Section */}
      <header className="header">Study with me</header>

      {/* Main Content Section*/}
      <main className="button_container">
        <button className="login_button" onClick={handleClickLogin}>login</button>
        <button className="sign_up_button" onClick={handleClickSignUp}>sign up</button>
        <button className="about_us_button" onClick={handleClickAboutUs}>about us</button>
      </main>

    </div>
  )
}

export default Home_page;
