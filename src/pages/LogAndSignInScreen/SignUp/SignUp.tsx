import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupRecaptcha, sendOtp, verifyOtp, cleanupRecaptcha } from '../../../firebase/auth';
import type { ConfirmationResult } from 'firebase/auth';
import { useAuth } from '../../../contexts/AuthContext';
import './SignUp.css';

const SignUp: React.FC = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber2, setPhoneNumber2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    // Setup reCAPTCHA when component mounts
    const initRecaptcha = () => {
      try {
        setupRecaptcha('recaptcha-container');
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
        const verifier = setupRecaptcha('recaptcha-container');
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

  const handleCreateAccount = async () => {
    if (name && email && address && phoneNumber2) {
      setLoading(true);
      setError('');
      
      try {
        console.log('Creating account:', { name, email, address, phoneNumber2 });
        
        // For phone authentication, the user is already authenticated after OTP verification
        // You can save additional user info to your database here
        // For now, we'll just proceed to success
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStep(4);
      } catch (error: any) {
        console.error('Error creating account:', error);
        setError(error.message || 'Failed to create account');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleLogIn = () => {
    navigate('/login');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="signup-content">
            <h1 className="signup-title">Can you input your number?</h1>
            <p className="signup-subtitle">You will receive a code on this number to verify your identity.</p>
            
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
          </div>
        );

      case 2:
        return (
          <div className="signup-content">
            <h1 className="signup-title">OTP Verification</h1>
            <p className="signup-subtitle">Enter the verification code sent to your number +91 {phoneNumber}</p>
            
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
                    id={`otp-${index}`}
                    type="text"
                    className="otp-input"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    maxLength={1}
                  />
                ))}
              </div>
              <p className="resend-link">
                <button className="link-button">Didn't receive code? Resend</button>
              </p>
            </div>
            
            <button 
              className="btn btn-primary"
              onClick={handleVerifyOTP}
              disabled={otp.join('').length < 6 || loading}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        );

      case 3:
        return (
          <div className="signup-content">
            <h1 className="signup-title">Almost Done!</h1>
            <p className="signup-subtitle">We need this information to create your account</p>
            
            {error && (
              <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
                {error}
              </div>
            )}
            
            <div className="form-section">
              <input
                type="text"
                className="form-input"
                placeholder="Enter Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                className="form-input"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Enter Complete Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <input
                type="tel"
                className="form-input"
                placeholder="Enter Secondary Phone Number"
                value={phoneNumber2}
                onChange={(e) => setPhoneNumber2(e.target.value)}
              />
            </div>
            
            <button 
              className="btn btn-primary"
              onClick={handleCreateAccount}
              disabled={!name || !email || !address || !phoneNumber2 || loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        );

      case 4:
        return (
          <div className="signup-content success-content">
            <div className="success-icon">
              <div className="checkmark">✓</div>
            </div>
            <h1 className="signup-title">You're Now with Your Trusted Guardian of Life!</h1>
            <p className="signup-subtitle">Welcome to the trygve family. Your journey to better health starts here.</p>
            
            <button 
              className="btn btn-primary"
              onClick={handleBackToLogin}
            >
              Back to Login
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="signup-container">
      <div id="recaptcha-container" style={{ display: 'none' }}></div>
      <div className="signup-background">
        <img src="/LogAndsignupBG.png" alt="Background" className="logo-bg" />
      </div>
      
      <button className="back-button" onClick={() => step > 1 ? setStep(step - 1) : navigate('/welcome')}>
        ←
      </button>
      
      {renderStep()}
    </div>
  );
};

export default SignUp;
