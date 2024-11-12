import React from 'react';
import Login_page from './components/Login_page';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home_page from './components/home_page';
import SignUp_page from './components/SignUp_page';
import Study_page from './components/Study_page';
const App = () => {
  
  return (
     <BrowserRouter>
        <Routes>
          <Route path="/" Component={Home_page} />
          <Route path="/login_page" Component={Login_page}/>
          <Route path="/SignUp_page" Component={SignUp_page}/>
          <Route path="/Study_page" Component={Study_page}/>
        </Routes>
     </BrowserRouter>
  )
}

export default App;
