import React,  { useState, useEffect }  from 'react';
import Login_page from './components/Login_page';
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Home_page from './components/Home_page';
import SignUp_page from './components/SignUp_page';
import Study_page from './components/Study_page';
import Setting_page from './components/Setting_page';
import useToken from './hooks/useToken';

const App = () => {
  const { token, setToken } = useToken();
  
  return (
     <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home_page />} />
          <Route 
            path="/login_page" 
            element={token ? (<Navigate replace to="/Study_page" />) : (<Login_page setToken={setToken} />) } />
          <Route path="/SignUp_page" element={<SignUp_page />}/>
          <Route path="/Study_page" element={<Study_page />}/> 
          <Route path="/Setting_page"element={<Setting_page />}/>
        </Routes>
     </BrowserRouter>
  )
}

export default App;
