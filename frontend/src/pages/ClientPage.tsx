import { useState } from 'react'
import Title from '../components/Title/Title'
import UrlBar from '../components/UrlBar/UrlBar'
import DonationModal from '../components/DonationModal/DonationModal'
import './ClientPage.css'

function ClientPage() {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)

  return (
    <div className="client-page">
      <Title />
      <UrlBar />
      
      <button 
        className="support-btn"
        onClick={() => setIsDonationModalOpen(true)}
      >
        Support Us
      </button>
      
      <DonationModal 
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
    </div>
  )
}

export default ClientPage