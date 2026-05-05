import { useState, useEffect } from 'react'
import './TypewriterText.css'

const TypewriterText = ({ 
  phrases = ["Soft scents.", "Clean skin vibes.", "Minimal luxury."],
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 1000
}) => {
  const [currentText, setCurrentText] = useState('')
  const [isTypingComplete, setIsTypingComplete] = useState(false)

  useEffect(() => {
    const currentPhrase = phrases[0] // Use first phrase only
    
    if (!isTypingComplete && currentText.length < currentPhrase.length) {
      // Typing
      const timer = setTimeout(() => {
        setCurrentText(currentPhrase.substring(0, currentText.length + 1))
      }, typingSpeed)
      return () => clearTimeout(timer)
    } else if (!isTypingComplete && currentText.length === currentPhrase.length) {
      // Finished typing, stop the cursor
      setIsTypingComplete(true)
    }
  }, [currentText, isTypingComplete, phrases, typingSpeed])

  return (
    <span className='typewriter-text'>
      {currentText}
      {!isTypingComplete && <span className='typewriter-cursor'>|</span>}
    </span>
  )
}

export default TypewriterText

