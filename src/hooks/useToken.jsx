import React, { useState, useEffect } from 'react';

export default function useToken() {
  // Function to retrieve the token from localStorage
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = tokenString ? JSON.parse(tokenString) : null;
    // console.log("token for login: ", userToken);

    return userToken; // Safely return token or null
  };

  // State for the token
  const [token, setToken] = useState(getToken()); // Initialize state with getToken value
  
  // Effect to sync state with localStorage whenever the component mounts
  useEffect(() => {
    const tokenFromLocalStorage = getToken();
    setToken(tokenFromLocalStorage);  // Update state with the token from localStorage
  }, [token]); // Empty dependency array means it only runs on mount

  // Function to save the token to localStorage and update the state
  const saveToken = (userToken) => {
    // console.log("User token", userToken.token);
    localStorage.setItem('token', JSON.stringify(userToken.token));
    setToken(userToken.token); // Update the state with the new token
  };

  return {
    setToken: saveToken, 
    token, // Current token state
  };
}
