import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupRecaptcha, sendOtp, cleanupRecaptcha } from '../../../firebase/auth';
import './SignUp.css';

const SignUpPhoneInput: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any potential Firebase state on mount
    sessionStorage.clear();
    
    // Clear any global Firebase state
    if ((window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier.clear();
      } catch (e) {
        // Ignore errors
      }
      (window as any).recaptchaVerifier = undefined;
    }
    
    console.log('PhoneInput loaded - Firebase authentication ready');
    
    return () => {
      // Cleanup on unmount
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
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const handleSendCode = async () => {
    if (phoneNumber.length >= 10) {
      setLoading(true);
      setError('');
      
      // Clear any previous session data to prevent conflicts
      sessionStorage.removeItem('signupConfirmationResult');
      sessionStorage.removeItem('signupUserAuth');
      sessionStorage.removeItem('signupUserDetails');
      
      try {
        // Production mode with Firebase
        const verifier = setupRecaptcha('signup-recaptcha-container');
        if (!verifier) {
          throw new Error('Failed to initialize reCAPTCHA');
        }
        
        const fullPhoneNumber = `+91${phoneNumber}`;
        const result = await sendOtp(fullPhoneNumber, verifier);
        
        // Store confirmation result and phone number for next step
        sessionStorage.setItem('signupPhoneNumber', phoneNumber);
        
        // Store the confirmation result in a global variable instead of sessionStorage
        // because ConfirmationResult cannot be serialized
        (window as any).signupConfirmationResult = result;
        
        navigate('/signup/otpverification');
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

  const handleLogIn = () => {
    navigate('/login');
  };

  return (
    <div className="signup-container">
      <div className="signup-background">
        <img src="/LogAndsignupBG.png" alt="Background" className="logo-bg" />
      </div>
      
      <button className="back-button" onClick={() => navigate('/welcome')}>
        ←
      </button>
      
      <div className="signup-content">
        <h1 className="signup-title">Can you input your number?</h1>
        <p className="signup-subtitle">You will receive a code on this number to verify your identity.</p>
        
        {error && <div className="error-message">{error}</div>}
        
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
          {loading ? 'Sending...' : 'Send Code'}
        </button>
        
        <div className="login-link">
          <p>
            Already have an account?{' '}
            <button className="link-button" onClick={handleLogIn}>
              log in
            </button>
          </p>
        </div>
        
        {/* reCAPTCHA container - must be visible */}
        <div id="signup-recaptcha-container" style={{ margin: '20px 0' }}></div>
      </div>
    </div>
  );
};

export default SignUpPhoneInput;
