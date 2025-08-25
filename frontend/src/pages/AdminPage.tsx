import { useState } from 'react'
import Login from '../components/Login/Login'
import Dashboard from '../components/Dashboard/Dashboard'

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = (success) => {
    setIsLoggedIn(success)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
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