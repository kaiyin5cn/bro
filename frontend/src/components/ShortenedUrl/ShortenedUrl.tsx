import { useState, useEffect } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'
import './ShortenedUrl.css'

interface ShortenedUrlProps {
  url: string;
}

function ShortenedUrl({ url }: ShortenedUrlProps) {
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
      <div className="copy-btn-container">
        <button onClick={handleCopy} className="copy-btn">
          {copied ? <FiCheck /> : <FiCopy />}
        </button>
        {copied && <div className="copied-text">Copied!</div>}
      </div>
    </div>
  )
}

export default ShortenedUrl