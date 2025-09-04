import { useState } from 'react'
import Title from '../components/Title/Title'
import UrlBar from '../components/UrlBar/UrlBar'
import DonationModal from '../components/DonationModal/DonationModal'
import GameModal from '../components/GameModal/GameModal'
import './ClientPage.css'

function ClientPage() {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)
  const [isGameModalOpen, setIsGameModalOpen] = useState(false)

  return (
    <div className="client-page">
      <Title />
      <UrlBar />
      
      <div className="action-buttons">
        <button 
          className="game-btn"
          onClick={() => setIsGameModalOpen(true)}
        >
          Play Snake Game
        </button>
        
        <button 
          className="support-btn"
          onClick={() => setIsDonationModalOpen(true)}
        >
          Support Us
        </button>
      </div>
      
      <DonationModal 
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
      
      <GameModal 
        isOpen={isGameModalOpen}
        onClose={() => setIsGameModalOpen(false)}
      />
    </div>
  )
}

export default ClientPage