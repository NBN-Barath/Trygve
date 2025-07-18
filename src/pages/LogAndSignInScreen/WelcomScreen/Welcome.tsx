import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleLogIn = () => {
    navigate('/login');
  };

  return (
    <div className="welcome-container">
      <div className="welcome-background">
        <img src="/LogAndSignInBG.png" alt="Background" className="logo-bg" />
      </div>
      
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to</h1>
        <h2 className="brand-name">trygve</h2>
        <p className="welcome-subtext">Your trusted partner for personalized healthcare, right at your doorstep.</p>
        
        <div className="welcome-buttons">
          <button className="btn btn-primary" onClick={handleSignUp}>
            Sign up
          </button>
          <button className="btn btn-secondary" onClick={handleLogIn}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
