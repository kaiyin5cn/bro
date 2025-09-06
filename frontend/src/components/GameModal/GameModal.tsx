import { useEffect } from 'react'
import { config } from '../../constants/config'
import './GameModal.css'

interface GameModalProps {
  isOpen: boolean
  onClose: () => void
}

function GameModal({ isOpen, onClose }: GameModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="game-modal-overlay" onClick={onClose}>
      <div className="game-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="game-modal-header">
          <h2>Snake Game</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="game-container">
          <iframe 
            key={isOpen ? 'game-loaded' : 'game-unloaded'}
            src={isOpen ? config.gameUrl : ""}
            width="600" 
            height="480"
            className="game-iframe"
            title="Snake Game"
          />
        </div>
      </div>
    </div>
  )
}

export default GameModal