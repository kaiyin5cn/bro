import { useState } from 'react'
import axios from 'axios'
import { FiLink, FiSend, FiLoader } from 'react-icons/fi'
import ShortenedUrl from '../ShortenedUrl/ShortenedUrl'
import './UrlBar.css'

function UrlBar() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [shortenedUrl, setShortenedUrl] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setLoading(true)
    
    setTimeout(() => {
      setLoading(false)
      setShortenedUrl('https://short.ly/abc123')
    }, 2000)
  }

  return (
    <div className="url-bar-container">
      <form onSubmit={handleSubmit} className="pill-form">
        <div className="pill-input">
          <FiLink className="url-icon" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL here..."
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? (
              <FiLoader className="loading-circle" />
            ) : (
              <FiSend />
            )}
          </button>
        </div>
      </form>
      {shortenedUrl && <ShortenedUrl url={shortenedUrl} />}
    </div>
  )
}

export default UrlBar