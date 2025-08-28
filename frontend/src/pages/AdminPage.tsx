import { useState, useEffect } from 'react'
import Login from '../components/Login/Login'
import Dashboard from '../components/Dashboard/Dashboard'
import './AdminPage.css'

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = (user: { id: string; username: string; role: string } | null) => {
    setIsLoggedIn(!!user)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
  }

  if (loading) {
    return <div className="admin-page loading">Loading...</div>
  }

  return (
    <div className="admin-page">
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  )
}

export default AdminPage