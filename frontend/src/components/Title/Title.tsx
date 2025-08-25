import { useEffect, useState } from 'react'
import './Title.css'

function Title() {
  const words = ["Shortening", "URL"]
  const [hoveredIndex, setHoveredIndex] = useState(-1)
  
  useEffect(() => {
    const totalChars = words.join('').length
    
    const startSequence = () => {
      for (let i = 0; i < totalChars; i++) {
        setTimeout(() => {
          setHoveredIndex(i)
          if (i === totalChars - 1) {
            setTimeout(() => setHoveredIndex(-1), 50)
          }
        }, i * 200)
      }
    }
    
    startSequence()
    const mainInterval = setInterval(startSequence, 5000)
    
    return () => clearInterval(mainInterval)
  }, [])
  
  return (
    <h1 className="title">
      {words.map((word, wordIndex) => {
        const wordStartIndex = words.slice(0, wordIndex).join('').length
        return (
          <span key={wordIndex} className="word">
            {word.split('').map((char, charIndex) => {
              const globalIndex = wordStartIndex + charIndex
              return (
                <span key={charIndex} className={`char ${hoveredIndex === globalIndex ? 'simulated-hover' : ''}`}>{char}</span>
              )
            })}
            {wordIndex < words.length - 1 && <span className="space"> </span>}
          </span>
        )
      })}
    </h1>
  )
}

export default Title