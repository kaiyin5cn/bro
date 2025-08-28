import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

const DONATION_CONTRACT_ADDRESS = '0xD8462e0A1a78E8ac07e0A414B5539680689071C8';
const DONATION_CONTRACT_ABI = [
  "function donate() external payable",
  "function ethToUSD(uint256 ethAmount) external view returns (uint256)",
  "event DonationReceived(address indexed donor, uint256 ethAmount, uint256 usdAmount, bool nftMinted, uint256 tokenId)"
];

export const useWeb3 = () => {
  const [account, setAccount] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(accounts[0]);
      return accounts[0];
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const donate = useCallback(async (ethAmount: string) => {
    if (!window.ethereum || !account) {
      throw new Error('Wallet not connected');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(DONATION_CONTRACT_ADDRESS, DONATION_CONTRACT_ABI, signer);

    const tx = await contract.donate({
      value: ethers.parseEther(ethAmount)
    });

    return tx;
  }, [account]);

  const getUSDAmount = useCallback(async (ethAmount: string) => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(DONATION_CONTRACT_ADDRESS, DONATION_CONTRACT_ABI, provider);
    
    const usdAmount = await contract.ethToUSD(ethers.parseEther(ethAmount));
    return parseFloat(ethers.formatEther(usdAmount));
  }, []);

  return {
    account,
    isConnecting,
    connectWallet,
    donate,
    getUSDAmount
  };
};

declare global {
  interface Window {
    ethereum?: any;
  }
}