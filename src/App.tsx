import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Onboarding from './pages/OnboardingScreen/Onboarding';
import Welcome from './pages/LogAndSignInScreen/WelcomScreen/Welcome';
import SignUp from './pages/LogAndSignInScreen/SignUp/SignUp';
import LogIn from './pages/LogAndSignInScreen/LogIn/LogIn';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
      </Routes>
    </Router>
  );
}

export default App;