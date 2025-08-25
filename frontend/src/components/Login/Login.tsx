import { useState } from 'react'
import { FiUser, FiLock } from 'react-icons/fi'
import './Login.css'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      if (username === 'admin' && password === 'password') {
        onLogin(true)
      } else {
        setError('Invalid username or password')
      }
      setLoading(false)
    }, 1000)
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