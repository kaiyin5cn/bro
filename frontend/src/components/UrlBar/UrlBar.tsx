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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      console.log('URL is empty, returning')
      return
    }
    
    setLoading(true)
    
    try {
      setError('')
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/shorten`, {
        longURL: url
      })
      
      setShortenedUrl(response.data.shortURL)
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
      {error && <div className="error-message">{error}</div>}
      {shortenedUrl && <ShortenedUrl url={shortenedUrl} />}
    </div>
  )
}

export default UrlBar