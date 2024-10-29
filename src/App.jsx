import React from 'react';
import Login_page from './components/Login_page';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home_page from './components/home_page';

const App = () => {
  
  return (
     <BrowserRouter>
        <Routes>
          <Route path="/" Component={Home_page} />
          <Route path="/login_page" Component={Login_page}/>
        </Routes>
     </BrowserRouter>
  )
}

export default App;
