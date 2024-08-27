import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';  
import LazyLoad from 'react-lazyload';

import "../CSS/navbar.css";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LaunchIcon from '@mui/icons-material/Launch';
import logo from "../logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('/');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); 
    setActiveTab(location.pathname); 
  }, [location.pathname]);

  const handlePostJob = () => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      axios.get('https://hirebackend-1.onrender.com/api/users/profile', {
        params: { email }
      })
      .then(response => {
        const { role } = response.data;
        navigate("/owner");
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
    } 
  }

  const handleClick = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <div className="navbar">
      <div className="logo">
        <LazyLoad height={40} offset={100} once>
          <img className="logoimg" src={logo} alt="Logo" />
        </LazyLoad>
      </div>
      <div className="icons">
        <div 
          className={`icon home ${activeTab === '/' ? 'active' : ''}`} 
          onClick={() => handleClick('/')}
        >
          <HomeIcon />
          <span>Home</span>
        </div>
        <div 
          className={`icon jobs ${activeTab === '/jobcard' ? 'active' : ''}`} 
          onClick={() => handleClick('/jobcard')}
        >
          <WorkIcon />
          <span>Jobs</span>
        </div>
        <div 
          className={`icon aboutus ${activeTab === '/about' ? 'active' : ''}`} 
          onClick={() => handleClick('/about')}
        >
          <InfoIcon />
          <span>About</span>
        </div>
        <div 
          className={`icon login ${activeTab === (isLoggedIn ? '/profile' : '/signin') ? 'active' : ''}`} 
          onClick={() => handleClick(isLoggedIn ? '/profile' : '/signin')}
        >
          {isLoggedIn ? (
            <>
              <AccountCircleIcon />
              <span>Profile</span>
            </>
          ) : (
            <>
              <LoginIcon />
              <span>Login</span>
            </>
          )}
        </div>
      </div>
      <div className="posting" onClick={handlePostJob}>
        <span>Employer/Post Job</span>
        <LaunchIcon className="posting-icon" />
      </div>
    </div>
  );
};

export default Navbar;
