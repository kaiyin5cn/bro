import axios from 'axios'
import { FiLink, FiSend, FiLoader } from 'react-icons/fi'
import ShortenedUrl from '../ShortenedUrl/ShortenedUrl'
import { URLValidator } from '../../constants/validation'
import { useUrlStore } from '../../store/urlStore'
import './UrlBar.css'

function UrlBar() {
  const { 
    url, 
    shortenedUrl, 
    loading, 
    error, 
    processedUrls,
    setUrl,
    setShortenedUrl,
    setLoading,
    setError,
    addProcessedUrl,
    clearError
  } = useUrlStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate URL using validation class
    const validation = URLValidator.validate(url)
    if (!validation.isValid) {
      setError(validation.error!)
      return
    }
    
    const trimmedUrl = url.trim()
    
    // Check if URL already processed
    if (processedUrls.has(trimmedUrl)) {
      setError('This URL has already been shortened')
      return
    }
    
    // Prevent shortening our own short URLs
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8828'
    const shortUrlPattern = new RegExp(`^${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/[a-zA-Z0-9]{7}$`)
    if (shortUrlPattern.test(trimmedUrl)) {
      setError('Cannot shorten an already shortened URL')
      return
    }
    
    setLoading(true)
    clearError()
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/shorten`, {
        longURL: trimmedUrl
      })
      setShortenedUrl(response.data.shortURL)
      addProcessedUrl(trimmedUrl)
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