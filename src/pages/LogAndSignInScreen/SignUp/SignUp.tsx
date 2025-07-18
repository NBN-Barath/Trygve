import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp: React.FC = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber2, setPhoneNumber2] = useState('');
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

  const handleCreateAccount = () => {
    if (name && email && address && phoneNumber2) {
      console.log('Creating account:', { name, email, address, phoneNumber2 });
      setStep(4);
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
      if (value && index < 3) {
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
              Send Code
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
              disabled={otp.join('').length < 4}
            >
              Verify
            </button>
          </div>
        );

      case 3:
        return (
          <div className="signup-content">
            <h1 className="signup-title">Almost Done!</h1>
            <p className="signup-subtitle">We need this information to create your account</p>
            
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
              disabled={!name || !email || !address || !phoneNumber2}
            >
              Create Account
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
