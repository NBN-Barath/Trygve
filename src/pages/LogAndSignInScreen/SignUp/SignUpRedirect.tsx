import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to phone input step
    navigate('/signup/phoneinput', { replace: true });
  }, [navigate]);

  return null;
};

export default SignUpRedirect;
