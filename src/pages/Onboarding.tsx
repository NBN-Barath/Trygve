import React, { useEffect, useState } from 'react';
import './Onboarding.css';

import Onbording1 from '../Onbording1.png';
import Onbording2 from '../Onbording2.png';
import Onbording3 from '../Onbording3.png';
import Onbording4 from '../Onbording4.png';

const screens = [
  {
    title: 'trygve',
    tagline: 'Trusted Guardian of Life',
    autoNext: true,
    duration: 2000,
    bg: Onbording1,
  },
  {
    title: 'Your Health, Our Priority',
    subheading: 'Trust doctors and care at door step',
    buttons: ['Skip', 'Next'],
    bg: Onbording2,
  },
  {
    title: 'Seamless Care, Delivered',
    subheading: 'Consult, treat, and heal—hassle-free',
    buttons: ['Skip', 'Next'],
    bg: Onbording3,
  },
  {
    title: 'Affordable Healthcare for Everyone',
    subheading: 'Quality care for every budget',
    buttons: ['Get Started'],
    bg: Onbording4,
  },
];

const Onboarding: React.FC = () => {
  const [screenIdx, setScreenIdx] = useState(0);

  useEffect(() => {
    if (screens[screenIdx].autoNext) {
      const timer = setTimeout(() => setScreenIdx(screenIdx + 1), screens[screenIdx].duration);
      return () => clearTimeout(timer);
    }
  }, [screenIdx]);

  const handleButton = (btn: string) => {
    if (btn === 'Skip') {
      setScreenIdx(screens.length - 1);
    } else if (btn === 'Next') {
      setScreenIdx(screenIdx + 1);
    } else if (btn === 'Get Started') {
      localStorage.setItem('onboardingComplete', 'true');
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'ArrowRight') {
        if (screens[screenIdx].buttons?.includes('Next')) handleButton('Next');
      }
      if (e.key === 'ArrowLeft' && screenIdx > 1) setScreenIdx(screenIdx - 1);
      if (screens[screenIdx].buttons?.includes('Skip') && e.key === 'Escape') handleButton('Skip');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [screenIdx]);

  return (
    <div className="onboarding-container">
      <img className="onboarding-bg" src={screens[screenIdx].bg} alt="background" />
      <div className="onboarding-overlay" />

      <div className="onboarding-content">
        <h1 className="onboarding-title">{screens[screenIdx].title}</h1>

        {screens[screenIdx].tagline && (
          <p className="onboarding-tagline">{screens[screenIdx].tagline}</p>
        )}

        {screens[screenIdx].subheading && (
          <p className="onboarding-subheading">{screens[screenIdx].subheading}</p>
        )}

        <div className="onboarding-buttons">
          {screens[screenIdx].buttons?.map((btn) => (
            <button
              key={btn}
              className="onboarding-button"
              onClick={() => handleButton(btn)}
              tabIndex={0}
              aria-label={btn}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {screenIdx !== 0 && (
        <div className="onboarding-dots">
          {[1, 2, 3].map((dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setScreenIdx(dotIdx)}
              className={`onboarding-dot ${screenIdx === dotIdx ? 'active' : ''}`}
              aria-label={`Go to screen ${dotIdx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Onboarding;

