import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOtp, setupRecaptcha, sendOtp } from '../../../firebase/auth';
import { useAuth } from '../../../contexts/AuthContext';
import './SignUp.css';

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    // Check if we have phone number from previous step
    const storedPhoneNumber = sessionStorage.getItem('signupPhoneNumber');
    if (!storedPhoneNumber) {
      // If no phone number, redirect back to phone input
      navigate('/signup/phoneinput', { replace: true });
      return;
    }
    setPhoneNumber(storedPhoneNumber);
    setError('');
  }, [navigate]);

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      setLoading(true);
      setError('');
      
      try {
        // Get confirmation result from global variable
        const confirmationResult = (window as any).signupConfirmationResult;
        if (!confirmationResult) {
          setError('No OTP session found. Please request OTP again.');
          setLoading(false);
          return;
        }
        
        // Verify OTP with Firebase
        const user = await verifyOtp(confirmationResult, otpCode);
        setUser(user);
        
        // Store user data for next step
        sessionStorage.setItem('signupUserAuth', JSON.stringify(user));
        
        // Clean up the global confirmation result
        (window as any).signupConfirmationResult = null;
        
        // Navigate to user details step
        navigate('/signup/userdetails');
      } catch (error: any) {
        console.error('Error verifying OTP:', error);
        let errorMessage = 'Failed to verify OTP';
        
        if (error.code === 'auth/invalid-verification-code') {
          errorMessage = 'Invalid OTP code';
        } else if (error.code === 'auth/code-expired') {
          errorMessage = 'OTP has expired. Please request a new one';
        } else if (error.code === 'auth/session-expired') {
          errorMessage = 'Session expired. Please try again';
        } else if (error.message && error.message.includes('invalid')) {
          errorMessage = 'Invalid OTP code';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`signup-otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleBackToPhoneInput = () => {
    // Clear all signup session data when going back
    sessionStorage.removeItem('signupPhoneNumber');
    sessionStorage.removeItem('signupConfirmationResult');
    sessionStorage.removeItem('signupUserAuth');
    sessionStorage.removeItem('signupUserDetails');
    
    // Clear the global confirmation result
    (window as any).signupConfirmationResult = null;
    
    navigate('/signup/phoneinput');
  };

  const handleResendOTP = async () => {
    if (!phoneNumber) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Setup reCAPTCHA and send new OTP
      const verifier = setupRecaptcha('otp-recaptcha-container');
      if (!verifier) {
        throw new Error('Failed to initialize reCAPTCHA');
      }
      
      const fullPhoneNumber = `+91${phoneNumber}`;
      const result = await sendOtp(fullPhoneNumber, verifier);
      
      // Update the global confirmation result
      (window as any).signupConfirmationResult = result;
      
      // Clear OTP inputs
      setOtp(['', '', '', '', '', '']);
      
      alert('New OTP sent successfully!');
    } catch (error: any) {
      console.error('Error resending OTP:', error);
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-background">
        <img src="/LogAndsignupBG.png" alt="Background" className="logo-bg" />
      </div>
      
      <button className="back-button" onClick={handleBackToPhoneInput}>
        ←
      </button>
      
      <div className="signup-content">
        <h1 className="signup-title">Enter OTP</h1>
        <p className="signup-subtitle">
          We've sent a 6-digit code to +91 {phoneNumber}. Please enter it below.
        </p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="otp-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`signup-otp-${index}`}
              type="text"
              className="otp-input"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              maxLength={1}
            />
          ))}
        </div>
        
        <button 
          className="btn btn-primary"
          onClick={handleVerifyOTP}
          disabled={otp.join('').length !== 6 || loading}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={handleBackToPhoneInput}
          style={{ marginTop: '1rem' }}
        >
          Change Phone Number
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={handleResendOTP}
          disabled={loading}
          style={{ marginTop: '0.5rem' }}
        >
          {loading ? 'Resending...' : 'Resend OTP'}
        </button>
        
        <div className="login-link">
          <p>
            Already have an account?{' '}
            <button className="link-button" onClick={() => navigate('/login')}>
              log in
            </button>
          </p>
        </div>
        
        {/* reCAPTCHA container for resend functionality */}
        <div id="otp-recaptcha-container" style={{ margin: '20px 0' }}></div>
      </div>
    </div>
  );
};

export default OTPVerification;
