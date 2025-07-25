import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const UserDetails: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber2, setPhoneNumber2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated from previous step
    const userAuth = sessionStorage.getItem('signupUserAuth');
    const phoneNumber = sessionStorage.getItem('signupPhoneNumber');
    
    if (!userAuth && !phoneNumber) {
      // If no authentication data, redirect back to phone input
      navigate('/signup/phoneinput', { replace: true });
      return;
    }
    
    setError('');
  }, [navigate]);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    // Basic email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Additional checks for common issues
    const trimmedEmail = email.trim().toLowerCase();
    
    // Check basic format
    if (!emailRegex.test(trimmedEmail)) {
      return false;
    }
    
    // Check for multiple @ symbols
    if ((trimmedEmail.match(/@/g) || []).length !== 1) {
      return false;
    }
    
    // Check for valid domain extension (at least 2 characters)
    const parts = trimmedEmail.split('@');
    if (parts.length !== 2) {
      return false;
    }
    
    const domain = parts[1];
    const domainParts = domain.split('.');
    if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
      return false;
    }
    
    // Check for invalid characters
    if (trimmedEmail.includes('..') || trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) {
      return false;
    }
    
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    
    // Clear previous email error
    setEmailError('');
    setIsEmailValid(false);
    
    // Validate email if it's not empty
    if (emailValue.trim()) {
      if (validateEmail(emailValue)) {
        setIsEmailValid(true);
      } else {
        setEmailError('Please enter a valid email address');
      }
    }
  };

  const handlePhoneNumber2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber2(value);
    }
  };

  const handleCreateAccount = async () => {
    // Clear previous errors
    setError('');
    setEmailError('');
    
    // Validate required fields
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    // Validate email format
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    if (name && email && validateEmail(email)) {
      setLoading(true);
      setError('');
      
      try {
        console.log('Creating account:', { name, email, address, phoneNumber2 });
        
        // Store user details for success page
        const userDetails = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          address: address.trim(),
          phoneNumber2
        };
        
        sessionStorage.setItem('signupUserDetails', JSON.stringify(userDetails));
        
        // Simulate account creation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        navigate('/signup/success');
      } catch (error: any) {
        console.error('Error creating account:', error);
        setError(error.message || 'Failed to create account');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackToOTP = () => {
    navigate('/signup/otpverification');
  };

  return (
    <div className="signup-container">
      <div className="signup-background">
        <img src="/LogAndsignupBG.png" alt="Background" className="logo-bg" />
      </div>
      
      <button className="back-button" onClick={handleBackToOTP}>
        ←
      </button>
      
      <div className="signup-content">
        <h1 className="signup-title">Complete Your Profile</h1>
        <p className="signup-subtitle">
          Please provide your details to complete the signup process.
        </p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="form-section">
          <input
            type="text"
            className="form-input"
            placeholder="Enter Full Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="input-group">
            <input
              type="email"
              className={`form-input ${emailError ? 'error' : isEmailValid ? 'valid' : ''}`}
              placeholder="Enter Email Address *"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && (
              <div className="field-error-message">
                {emailError}
              </div>
            )}
            {isEmailValid && !emailError && (
              <div className="field-success-message">
                ✓ Valid email address
              </div>
            )}
          </div>
          <input
            type="text"
            className="form-input"
            placeholder="Enter Complete Address (Optional)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="tel"
            className="form-input"
            placeholder="Enter Secondary Phone Number (Optional)"
            value={phoneNumber2}
            onChange={handlePhoneNumber2Change}
          />
        </div>
        
        <button 
          className="btn btn-primary"
          onClick={handleCreateAccount}
          disabled={!name.trim() || !email.trim() || !isEmailValid || emailError !== '' || loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <div className="login-link">
          <p>
            Already have an account?{' '}
            <button className="link-button" onClick={() => navigate('/login')}>
              log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
