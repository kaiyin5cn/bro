import { useState, useEffect } from 'react'
import { FiEdit, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import axios from 'axios'
import { useAuthStore } from '../../store/authStore'
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

type SortField = 'longURL' | 'shortCode' | 'accessCount' | 'createdAt'
type SortOrder = 'asc' | 'desc'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

interface DashboardProps {
  onLogout: () => void;
}

function Dashboard({ onLogout }: DashboardProps) {
  const { logout } = useAuthStore()
  const [urlData, setUrlData] = useState<UrlData[]>([])
  const [loading, setLoading] = useState(true)
  const [sortLoading, setSortLoading] = useState(false)
  const [editModal, setEditModal] = useState<Modal>({ show: false, item: null })
  const [deleteModal, setDeleteModal] = useState<Modal>({ show: false, item: null })
  const [editValue, setEditValue] = useState('')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [notification, setNotification] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('error')

  useEffect(() => {
    fetchUrls()
  }, [currentPage, itemsPerPage])
  
  useEffect(() => {
    if (!loading) {
      fetchUrls(true)
    }
  }, [sortField, sortOrder])

  const fetchUrls = async (isSort = false) => {
    try {
      if (isSort) setSortLoading(true)
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sortField,
        sortOrder
      }
      
      const response = await axios.get(`${API_BASE}/admin/urls`, {
        headers: getAuthHeaders(),
        params
      })
      
      setUrlData(response.data.urls)
      setTotalPages(response.data.pagination.pages)
      setTotalItems(response.data.pagination.total)
    } catch (error: any) {
      if (error.response?.status === 401) {
        logout()
      } else {
        setNotificationType('error')
        setNotification('Failed to load data from server')
        setTimeout(() => setNotification(''), 5000)
      }
    } finally {
      setLoading(false)
      setSortLoading(false)
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
      setNotificationType('success')
      setNotification('URL updated successfully')
      setTimeout(() => setNotification(''), 3000)
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Edit failed'
      setNotificationType('error')
      setNotification(errorMessage)
      setTimeout(() => setNotification(''), 5000)
    }
  }

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/admin/urls/${deleteModal.item?._id}`, {
        headers: getAuthHeaders()
      })
      await fetchUrls()
      setDeleteModal({ show: false, item: null })
      setNotificationType('success')
      setNotification('URL deleted successfully')
      setTimeout(() => setNotification(''), 3000)
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Delete failed'
      setNotificationType('error')
      setNotification(errorMessage)
      setTimeout(() => setNotification(''), 5000)
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }

  // Data is already sorted by backend

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortOrder === 'asc' ? <FiChevronUp /> : <FiChevronDown />
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
          <>
            <div className="table-controls">
              <div className="items-per-page">
                <label>Items per page:</label>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="pagination-top">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  ← Previous
                </button>
                
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next →
                </button>
              </div>
              <div className="total-items">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
              </div>
            </div>
            <div className="table-container">
              <table className="url-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleSort('longURL')}>
                    URL <SortIcon field="longURL" />
                  </th>
                  <th className="sortable" onClick={() => handleSort('shortCode')}>
                    Short Code <SortIcon field="shortCode" />
                  </th>
                  <th className="sortable" onClick={() => handleSort('accessCount')}>
                    Access Count <SortIcon field="accessCount" />
                  </th>
                  <th className="sortable" onClick={() => handleSort('createdAt')}>
                    Created <SortIcon field="createdAt" />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortLoading && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                      <div className="loading-spinner">Loading...</div>
                    </td>
                  </tr>
                )}
                {!sortLoading && urlData.map(item => (
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
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              
              <div className="pagination-info">
                Page {currentPage} of {totalPages}
              </div>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          </>
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
      
      {notification && (
        <div className={`notification ${notificationType}`}>
          {notification}
        </div>
      )}
    </div>
  )
}

export default Dashboard