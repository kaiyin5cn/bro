import { useState, useEffect } from 'react'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import axios from 'axios'
import './Dashboard.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8828'

interface UrlData {
  _id: string;
  longURL: string;
  shortCode: string;
  accessCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Modal {
  show: boolean;
  item: UrlData | null;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

interface DashboardProps {
  onLogout: () => void;
}

function Dashboard({ onLogout }: DashboardProps) {
  const [urlData, setUrlData] = useState<UrlData[]>([])
  const [loading, setLoading] = useState(true)
  const [editModal, setEditModal] = useState<Modal>({ show: false, item: null })
  const [deleteModal, setDeleteModal] = useState<Modal>({ show: false, item: null })
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    fetchUrls()
  }, [])

  const fetchUrls = async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin/urls`, {
        headers: getAuthHeaders()
      })
      setUrlData(response.data)
    } catch (error) {
      if (error.response?.status === 401) {
        onLogout()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: UrlData) => {
    setEditValue(item.shortCode)
    setEditModal({ show: true, item })
  }

  const handleDelete = (item: UrlData) => {
    setDeleteModal({ show: true, item })
  }

  const confirmEdit = async () => {
    try {
      await axios.put(`${API_BASE}/admin/urls/${editModal.item?._id}`, {
        shortCode: editValue
      }, {
        headers: getAuthHeaders()
      })
      await fetchUrls()
      setEditModal({ show: false, item: null })
    } catch (error) {
      console.error('Edit failed:', error)
    }
  }

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/admin/urls/${deleteModal.item?._id}`, {
        headers: getAuthHeaders()
      })
      await fetchUrls()
      setDeleteModal({ show: false, item: null })
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </header>
      <div className="dashboard-content">
        {loading ? (
          <div></div>
        ) : (
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
                {urlData.map(item => (
                  <tr key={item._id}>
                    <td className="url-cell">{item.longURL}</td>
                    <td>{item.shortCode}</td>
                    <td>{item.accessCount}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <div className="tooltip-container">
                      <button className="edit-btn" onClick={() => handleEdit(item)}>
                        <FiEdit />
                      </button>
                      <div className="tooltip">Edit</div>
                    </div>
                    <div className="tooltip-container">
                      <button className="delete-btn" onClick={() => handleDelete(item)}>
                        <FiTrash2 />
                      </button>
                      <div className="tooltip">Delete</div>
                    </div>
                  </td>
                </tr>
              ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      
      {editModal.show && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Short Code</h3>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="modal-input"
            />
            <div className="modal-actions">
              <button onClick={confirmEdit} className="confirm-btn">Save</button>
              <button onClick={() => setEditModal({ show: false, item: null })} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      {deleteModal.show && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this URL?</p>
            <div className="modal-actions">
              <button onClick={confirmDelete} className="delete-confirm-btn">Delete</button>
              <button onClick={() => setDeleteModal({ show: false, item: null })} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard