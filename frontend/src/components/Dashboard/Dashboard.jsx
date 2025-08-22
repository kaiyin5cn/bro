import { useState } from 'react'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import './Dashboard.css'

function Dashboard({ onLogout }) {
  const [urlData, setUrlData] = useState([
    {
      id: 1,
      url: 'https://www.example.com/very-long-url-path',
      shortCode: 'abc123',
      createdDate: '2024-01-15',
      lastUpdated: '2024-01-20'
    },
    {
      id: 2,
      url: 'https://www.google.com/search?q=example',
      shortCode: 'xyz789',
      createdDate: '2024-01-10',
      lastUpdated: '2024-01-18'
    },
    {
      id: 3,
      url: 'https://github.com/user/repository',
      shortCode: 'gh456',
      createdDate: '2024-01-05',
      lastUpdated: '2024-01-15'
    }
  ])
  const [editModal, setEditModal] = useState({ show: false, item: null })
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null })
  const [editValue, setEditValue] = useState('')

  const handleEdit = (item) => {
    setEditValue(item.shortCode)
    setEditModal({ show: true, item })
  }

  const handleDelete = (item) => {
    setDeleteModal({ show: true, item })
  }

  const confirmEdit = () => {
    setUrlData(prev => prev.map(item => 
      item.id === editModal.item.id 
        ? { ...item, shortCode: editValue, lastUpdated: new Date().toISOString().split('T')[0] }
        : item
    ))
    setEditModal({ show: false, item: null })
  }

  const confirmDelete = () => {
    setUrlData(prev => prev.filter(item => item.id !== deleteModal.item.id))
    setDeleteModal({ show: false, item: null })
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
        <div className="table-container">
          <table className="url-table">
            <thead>
              <tr>
                <th>URL</th>
                <th>Short Code</th>
                <th>Created</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {urlData.map(item => (
                <tr key={item.id}>
                  <td className="url-cell">{item.url}</td>
                  <td>{item.shortCode}</td>
                  <td>{item.createdDate}</td>
                  <td>{item.lastUpdated}</td>
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