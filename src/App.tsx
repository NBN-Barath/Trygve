import { useState } from 'react'
import './App.css'
import Onboarding from './pages/Onboarding'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Onboarding />
    </>
  )
}

export default App