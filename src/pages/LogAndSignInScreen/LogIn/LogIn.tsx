import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogIn.css';

const LogIn: React.FC = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const navigate = useNavigate();

  const handleSendCode = () => {
    if (phoneNumber.length >= 10) {
      console.log('Sending code to:', '+91' + phoneNumber);
      setStep(2);
    }
  };

  const handleVerifyOTP = () => {
    const otpCode = otp.join('');
    if (otpCode.length === 4) {
      console.log('Verifying OTP:', otpCode);
      setStep(3);
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
      if (value && index < 3) {
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
            
            <div className="phone-input-section">
              <div className="phone-input-container">
                <div className="country-code">
                  <span>🇮🇳 +91</span>
                </div>
                <input
                  type="tel"
                  className="phone-input"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  maxLength={10}
                />
              </div>
            </div>
            
            <button 
              className="btn btn-primary"
              onClick={handleSendCode}
              disabled={phoneNumber.length < 10}
            >
              Continue
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
              disabled={otp.join('').length < 4}
            >
              Continue
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
      <div className="login-background">
        <img src="/LogAndSignInBG.png" alt="Background" className="logo-bg" />
      </div>
      
      <button className="back-button" onClick={() => step > 1 ? setStep(step - 1) : navigate('/welcome')}>
        ←
      </button>
      
      {renderStep()}
    </div>
  );
};

export default LogIn;
