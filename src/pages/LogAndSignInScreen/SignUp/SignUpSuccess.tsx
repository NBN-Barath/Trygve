import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUpSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    // Check if we have signup data
    const storedUserDetails = sessionStorage.getItem('signupUserDetails');
    const storedPhoneNumber = sessionStorage.getItem('signupPhoneNumber');
    
    if (!storedUserDetails && !storedPhoneNumber) {
      // If no signup data, redirect back to start
      navigate('/signup/phoneinput', { replace: true });
      return;
    }

    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails));
    }
    
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
    }
  }, [navigate]);

  const handleContinue = () => {
    // Clear signup session data
    sessionStorage.removeItem('signupPhoneNumber');
    sessionStorage.removeItem('signupConfirmationResult');
    sessionStorage.removeItem('signupUserAuth');
    sessionStorage.removeItem('signupUserDetails');
    
    // Navigate to main app or dashboard
    navigate('/dashboard');
  };

  const handleBackToLogin = () => {
    // Clear signup session data
    sessionStorage.removeItem('signupPhoneNumber');
    sessionStorage.removeItem('signupConfirmationResult');
    sessionStorage.removeItem('signupUserAuth');
    sessionStorage.removeItem('signupUserDetails');
    
    navigate('/login');
  };

  return (
    <div className="signup-container">
      <div className="signup-background">
        <img src="/LogAndsignupBG.png" alt="Background" className="logo-bg" />
      </div>
      
      <div className="signup-content">
        <div className="success-icon">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h1 className="signup-title">Account Created Successfully!</h1>
        <p className="signup-subtitle">
          Welcome! Your account has been created and verified.
        </p>
        
        {userDetails && (
          <div className="user-info">
            <p><strong>Name:</strong> {userDetails.name}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Phone:</strong> +91 {phoneNumber}</p>
            {userDetails.address && <p><strong>Address:</strong> {userDetails.address}</p>}
            {userDetails.phoneNumber2 && <p><strong>Secondary Phone:</strong> +91 {userDetails.phoneNumber2}</p>}
          </div>
        )}
        
        <button 
          className="btn btn-primary"
          onClick={handleContinue}
        >
          Continue to App
        </button>
        
        <div className="login-link">
          <p>
            Want to use a different account?{' '}
            <button className="link-button" onClick={handleBackToLogin}>
              log in instead
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpSuccess;
