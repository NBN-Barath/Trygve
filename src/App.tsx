import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Onboarding from './pages/OnboardingScreen/Onboarding';
import Welcome from './pages/LogAndSignInScreen/WelcomScreen/Welcome';

// Signup Flow Components
import SignUpRedirect from './pages/LogAndSignInScreen/SignUp/SignUpRedirect';
import SignUpPhoneInput from './pages/LogAndSignInScreen/SignUp/SignUpPhoneInput';
import OTPVerification from './pages/LogAndSignInScreen/SignUp/OTPVerification';
import UserDetails from './pages/LogAndSignInScreen/SignUp/UserDetails';
import SignUpSuccess from './pages/LogAndSignInScreen/SignUp/SignUpSuccess';

// Login Component (original)
import LogIn from './pages/LogAndSignInScreen/LogIn/LogIn';

import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/welcome" element={<Welcome />} />
          
          {/* Signup Flow - All separate endpoints */}
          <Route path="/signup" element={<SignUpRedirect />} />
          <Route path="/signup/phoneinput" element={<SignUpPhoneInput />} />
          <Route path="/signup/otpverification" element={<OTPVerification />} />
          <Route path="/signup/userdetails" element={<UserDetails />} />
          <Route path="/signup/success" element={<SignUpSuccess />} />
          
          {/* Login Flow - Original component for now */}
          <Route path="/login" element={<LogIn />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;