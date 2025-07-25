import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupRecaptcha, sendOtp, verifyOtp, cleanupRecaptcha } from '../../../firebase/auth';
import type { ConfirmationResult } from 'firebase/auth';
import { useAuth } from '../../../contexts/AuthContext';
import './LogIn.css';

const LogIn: React.FC = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    // Setup reCAPTCHA when component mounts
    const initRecaptcha = () => {
      try {
        setupRecaptcha('login-recaptcha-container');
      } catch (error) {
        console.error('Error setting up reCAPTCHA:', error);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initRecaptcha, 100);

    return () => {
      clearTimeout(timer);
      // Cleanup reCAPTCHA when component unmounts
      cleanupRecaptcha();
    };
  }, []);

  // Format phone number with space after 5 digits
  const formatPhoneNumber = (value: string) => {
    const cleanedValue = value.replace(/\D/g, '');
    if (cleanedValue.length > 5) {
      return cleanedValue.slice(0, 5) + ' ' + cleanedValue.slice(5, 10);
    }
    return cleanedValue;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const handleSendCode = async () => {
    if (phoneNumber.length >= 10) {
      setLoading(true);
      setError('');
      try {
        // Ensure reCAPTCHA is properly set up
        const verifier = setupRecaptcha('login-recaptcha-container');
        if (!verifier) {
          throw new Error('Failed to initialize reCAPTCHA');
        }
        
        const fullPhoneNumber = `+91${phoneNumber}`;
        const result = await sendOtp(fullPhoneNumber, verifier);
        setConfirmationResult(result);
        setStep(2);
      } catch (error: any) {
        console.error('Error sending code:', error);
        let errorMessage = 'Failed to send OTP';
        
        if (error.code === 'auth/invalid-phone-number') {
          errorMessage = 'Invalid phone number format';
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = 'Too many attempts. Please try again later';
        } else if (error.message.includes('reCAPTCHA')) {
          errorMessage = 'reCAPTCHA verification failed. Please try again';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6 && confirmationResult) {
      setLoading(true);
      setError('');
      try {
        const user = await verifyOtp(confirmationResult, otpCode);
        setUser(user);
        setStep(3);
      } catch (error: any) {
        console.error('Error verifying OTP:', error);
        let errorMessage = 'Failed to verify OTP';
        
        if (error.code === 'auth/invalid-verification-code') {
          errorMessage = 'Invalid OTP';
        } else if (error.code === 'auth/code-expired') {
          errorMessage = 'OTP has expired. Please request a new one';
        } else if (error.code === 'auth/session-expired') {
          errorMessage = 'Session expired. Please try again';
        } else if (error.message && error.message.includes('invalid')) {
          errorMessage = 'Invalid OTP';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleContinue = () => {
    // Navigate to main app or dashboard
    navigate('/dashboard');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`login-otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="login-content">
            <div className="login-icon">
              <div className="user-icon">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#2563eb"/>
                  <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#2563eb"/>
                </svg>
              </div>
            </div>
            
            <h1 className="login-title">OTP Verification</h1>
            <p className="login-subtitle">Enter verified user phone number to send OTP then Passcode</p>
            
            {error && (
              <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
                {error}
              </div>
            )}
            
            <div className="phone-input-section">
              <div className="phone-input-container compact">
                <div className="country-code">
                  <span>🇮🇳 +91</span>
                </div>
                <input
                  type="tel"
                  className="phone-input"
                  value={formatPhoneNumber(phoneNumber)}
                  onChange={handlePhoneNumberChange}
                />
              </div>
            </div>
            
            <button 
              className="btn btn-primary"
              onClick={handleSendCode}
              disabled={phoneNumber.length < 10 || loading}
            >
              {loading ? 'Sending...' : 'Continue'}
            </button>
            
            <div className="signup-link">
              <p>
                Don't have an account?{' '}
                <button className="link-button" onClick={handleSignUp}>
                  Sign up
                </button>
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="login-content">
            <h1 className="login-title">Verification Code</h1>
            <p className="login-subtitle">We texted you the verification code to your entered number</p>
            
            {error && (
              <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
                {error}
              </div>
            )}
            
            <div className="otp-input-section">
              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`login-otp-${index}`}
                    type="text"
                    className="otp-input"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    maxLength={1}
                  />
                ))}
              </div>
            </div>
            
            <button 
              className="btn btn-primary"
              onClick={handleVerifyOTP}
              disabled={otp.join('').length < 6 || loading}
            >
              {loading ? 'Verifying...' : 'Continue'}
            </button>
          </div>
        );

      case 3:
        return (
          <div className="login-content success-content">
            <div className="success-icon">
              <div className="checkmark">✓</div>
            </div>
            <h1 className="login-title">Welcome Back to TRYGVE!</h1>
            <p className="login-subtitle">Your trusted guardian of life is ready to help you on your health journey</p>
            
            <button 
              className="btn btn-primary"
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="login-container">
      <div id="login-recaptcha-container" style={{ display: 'none' }}></div>
      <div className="login-background">
        <img src="/loginpage2.png" alt="Background" className="logo-bg" />
      </div>
      
      <button className="back-button" onClick={() => step > 1 ? setStep(step - 1) : navigate('/welcome')}>
        ←
      </button>
      
      {renderStep()}
    </div>
  );
};

export default LogIn;
