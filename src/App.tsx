import { useState } from 'react'
import './App.css'
import Onboarding from './pages/OnboardingScreen/Onboarding'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Onboarding />
    </>
  )
}

export default App