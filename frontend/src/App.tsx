import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ClientPage from './pages/ClientPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  )
}

export default App
