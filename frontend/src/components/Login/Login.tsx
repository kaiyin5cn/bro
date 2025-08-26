import { useState } from 'react'
import { FiUser, FiLock } from 'react-icons/fi'
import axios from 'axios'
import './Login.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8828'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const startTime = Date.now()
    
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        username,
        password
      })
      
      const { token, user } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      // Ensure minimum 2-second delay
      const elapsed = Date.now() - startTime
      const remainingDelay = Math.max(0, 2000 - elapsed)
      
      setTimeout(() => {
        onLogin(user)
        setLoading(false)
      }, remainingDelay)
    } catch (error) {
      // Ensure minimum 2-second delay for errors too
      const elapsed = Date.now() - startTime
      const remainingDelay = Math.max(0, 2000 - elapsed)
      
      setTimeout(() => {
        setError(error.response?.data?.error || 'Login failed')
        setLoading(false)
      }, remainingDelay)
    }
  }

  return (
    <div className="login-container">
      {loading && (
        <div className="suspense-overlay">
          <div className="loading-circle"></div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Admin Login</h2>
        
        <div className="input-group">
          <FiUser className="input-icon" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <FiLock className="input-icon" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={loading}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className="login-btn">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default Login