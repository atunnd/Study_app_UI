import React, { useState } from 'react';
import './Setting_page.css';
import axios from 'axios';

const Setting_page = () => {
  // Initialize state for user details, password, and chatbot API settings
  document.title = 'Study With Me';

  const [newPassword, setNewPassword] = useState('');
  const [apiKey, setApiKey] = useState('');

  // Handle changes for new password and API key
  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000', 
  });
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Save the new password and API key to localStorage (or send to your server)
    localStorage.setItem('user_password', newPassword);
    localStorage.setItem('chatbot_api_key', apiKey);

    {/* Update Password */}
    if (newPassword)
    {
        try {
            const userId = localStorage.getItem('user_id');
            const tokenString = localStorage.getItem('token'); // Retrieve token from localStorage
            const token = tokenString ? JSON.parse(tokenString) : null;
           

            const response = await axiosInstance.put(
                `/user/${userId}/password`, 
                {
                  name: "",
                  mail: "",
                  password: newPassword.toString(),
                  gemini_api: ""
                },
                {
                  headers: 
                  {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Bearer token for authorization
                  },
                }
              );
              
      
            if (response.status === 200) {
              alert('Password updated successfully');
            }
          } catch (error) {
            console.error('Error updating password:', error);
            alert('Failed to update password. Please try again.');
          }
    }

    if (apiKey)
    {
      try {
        const userId = localStorage.getItem('user_id');
        const tokenString = localStorage.getItem('token'); // Retrieve token from localStorage
        const token = tokenString ? JSON.parse(tokenString) : null;
       

        const response = await axiosInstance.put(
            `/user/${userId}/chatbot-api`, 
            {
              name: "",
              mail: "",
              password: "",
              gemini_api: apiKey.toString(),
            },
            {
              headers: 
              {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,  // Bearer token for authorization
              },
            }
          );
          
  
        if (response.status === 200) {
          alert('Chatbot Api updated successfully');
        }
      } catch (error) {
        console.error('Error updating Chatbot Api', error);
        alert('Failed to update Chatbot Api. Please try again.');
      }
    }

  };

  return (
    <div className="settings-container">
      <h1 className='header_title'>User Settings</h1>
      <form className='user-information-form' onSubmit={handleSubmit}>
        {/* username field*/}
        <div className="input-label">Username:
          <p className='user-name'>{localStorage.getItem('user_name')}</p>
        </div>
        
        {/* email field*/}
        <div className="input-label">Email:
          <p className='user-mail'>{localStorage.getItem('mail')}</p>
        </div>
        
        {/* password field*/}
        <div className="input-label">New Password:
          <input
            type="password"
            value={newPassword}
            onChange={handlePasswordChange}
            placeholder='Enter new password'
            className="input-field-password"
          />
        </div>
        
        {/* Chatbot API field*/}
        <div className="input-label">Chatbot API:
          <input
            type="password"
            placeholder="Enter Gemini API"
            value={apiKey}
            onChange={handleApiKeyChange}
            className="input-field-chatbot"
          />
        </div>

        {/* Buttons */}
        <button type="submit" className="submit-button">Save</button>
        <button className='delete-account-btn'>Delete Account</button>
      </form>
    </div>
  );
};

export default Setting_page;
