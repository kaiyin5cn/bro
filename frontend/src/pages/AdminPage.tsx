import { useState, useEffect } from 'react'
import Login from '../components/Login/Login'
import Dashboard from '../components/Dashboard/Dashboard'
import '../components/Dashboard/Dashboard.css'
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
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <button className="logout-btn">Logout</button>
        </header>
        <div className="dashboard-content">
          <div className="table-container">
            <table className="url-table">
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Short Code</th>
                  <th>Access Count</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td><div className="skeleton skeleton-text"></div></td>
                    <td><div className="skeleton skeleton-text"></div></td>
                    <td><div className="skeleton skeleton-text"></div></td>
                    <td><div className="skeleton skeleton-text"></div></td>
                    <td><div className="skeleton skeleton-text"></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
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