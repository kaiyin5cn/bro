import { useState } from 'react'
import axios from 'axios'
import { FiLink, FiSend, FiLoader } from 'react-icons/fi'
import ShortenedUrl from '../ShortenedUrl/ShortenedUrl'
import './UrlBar.css'

function UrlBar() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [shortenedUrl, setShortenedUrl] = useState('')
  const [error, setError] = useState('')
  const [processedUrls, setProcessedUrls] = useState<Set<string>>(new Set())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      console.log('URL is empty, returning')
      return
    }
    
    // Check if URL already processed
    if (processedUrls.has(url.trim())) {
      setError('This URL has already been shortened')
      return
    }
    
    // Prevent shortening our own short URLs
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8828'
    const shortUrlPattern = new RegExp(`^${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/[a-zA-Z0-9]{7}$`)
    if (shortUrlPattern.test(url.trim())) {
      setError('Cannot shorten an already shortened URL')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/shorten`, {
        longURL: url
      })
      setShortenedUrl(response.data.shortURL)
      setProcessedUrls(prev => new Set(prev).add(url.trim()))
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to shorten URL'
      setError(errorMessage)
      console.error('Error shortening URL:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="url-bar-container">
      <form onSubmit={handleSubmit} className="pill-form">
        <div className="pill-input">
          <FiLink className="url-icon" />
          <input
            type="text"
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
      {error && <div className="error-message">{error}</div>}
      {shortenedUrl && <ShortenedUrl url={shortenedUrl} />}
    </div>
  )
}

export default UrlBar