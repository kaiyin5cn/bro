import { useEffect } from 'react'
import Login from '../components/Login/Login'
import Dashboard from '../components/Dashboard/Dashboard'
import { useAuthStore } from '../store/authStore'
import './AdminPage.css'

function AdminPage() {
  const { isLoggedIn, notification, notificationType, initializeAuth, logout } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    <div className="admin-page">
      {isLoggedIn ? (
        <Dashboard onLogout={logout} />
      ) : (
        <Login />
      )}
      
      {notification && (
        <div className={`notification ${notificationType}`}>
          {notification}
        </div>
      )}
    </div>
  )
}

export default AdminPage