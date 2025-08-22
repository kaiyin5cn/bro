import { useState, useEffect } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'
import './ShortenedUrl.css'

function ShortenedUrl({ url }) {
  const [copied, setCopied] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(false)
    const timer = setTimeout(() => {
      setAnimate(true)
    }, 50)
    return () => clearTimeout(timer)
  }, [url])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className={`shortened-url ${animate ? 'animate' : ''}`}>
      <span className="url-text">{url}</span>
      <button onClick={handleCopy} className="copy-btn">
        {copied ? <FiCheck /> : <FiCopy />}
      </button>
    </div>
  )
}

export default ShortenedUrl