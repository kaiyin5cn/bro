import React, { useState, useEffect } from 'react';
import './DonationModal.css';
import { useWeb3 } from '../../hooks/useWeb3';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [ethAmount, setEthAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [usdAmount, setUsdAmount] = useState<number | null>(null);
  
  const { account, isConnecting, connectWallet, donate, getUSDAmount } = useWeb3();

  useEffect(() => {
    if (ethAmount && parseFloat(ethAmount) > 0) {
      const timer = setTimeout(async () => {
        try {
          const usd = await getUSDAmount(ethAmount);
          setUsdAmount(usd);
        } catch (error) {
          setUsdAmount(null);
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setUsdAmount(null);
    }
  }, [ethAmount, getUSDAmount]);

  const handleConnect = async () => {
    try {
      await connectWallet();
      setMessage('Wallet connected successfully!');
    } catch (error: any) {
      if (error.message?.includes('MetaMask not installed')) {
        setMessage('Please install MetaMask browser extension to donate.');
      } else if (error.message?.includes('User rejected')) {
        setMessage('Connection cancelled. Click "Connect Wallet" to try again.');
      } else {
        setMessage('Unable to connect wallet. Please make sure MetaMask is unlocked.');
      }
    }
  };

  const handleDonate = async () => {
    if (!account) {
      setMessage('Please connect your wallet first');
      return;
    }

    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      setMessage('Please enter a valid ETH amount');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const tx = await donate(ethAmount);
      setMessage('Transaction sent! Waiting for confirmation...');
      
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        // Track the donation in backend
        await fetch('/donation/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transactionHash: receipt.hash,
            donorAddress: account,
            ethAmount: parseFloat(ethAmount),
            usdAmount: usdAmount || 0
          })
        });
        
        const nftEligible = usdAmount && usdAmount >= 100;
        setMessage(`Donation successful! ${nftEligible ? 'NFT minted to your wallet.' : 'NFT requires minimum $100 USD.'}`);
        setEthAmount('');
        setUsdAmount(null);
      } else {
        setMessage('Transaction failed');
      }
    } catch (error: any) {
      if (error.code === 4001) {
        setMessage('You cancelled the transaction. No worries, try again when ready!');
      } else if (error.code === -32603) {
        setMessage('Network is busy. Please try again in a moment.');
      } else if (error.message?.includes('insufficient funds')) {
        setMessage('Not enough ETH in your wallet for this donation.');
      } else if (error.message?.includes('user rejected')) {
        setMessage('Transaction was declined. Feel free to try again!');
      } else {
        setMessage('Something went wrong. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Support Us</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <p>Donate ETH and receive an NFT for donations ≥ $100 USD!</p>
          
          {!account ? (
            <button 
              className="connect-btn" 
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <div className="wallet-info">
              <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
            </div>
          )}
          
          <div className="form-group">
            <label>ETH Amount:</label>
            <input
              type="number"
              step="0.001"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              placeholder="0.05"
              disabled={!account}
            />
            {usdAmount && (
              <p className="usd-amount">≈ ${usdAmount.toFixed(2)} USD</p>
            )}
          </div>
          
          {message && (
            <div className={`message ${message.includes('failed') || message.includes('error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
          
          <button 
            className="donate-btn" 
            onClick={handleDonate}
            disabled={isLoading || !account || !ethAmount}
          >
            {isLoading ? 'Processing...' : 'Donate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;