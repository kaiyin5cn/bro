import { useState, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';

const DONATION_CONTRACT_ADDRESS = '0xD8462e0A1a78E8ac07e0A414B5539680689071C8';
const DONATION_CONTRACT_ABI = [
  "function donate() external payable",
  "function ethToUSD(uint256 ethAmount) external view returns (uint256)",
  "function withdraw() external",
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
      // Request wallet selection dialog
      const accounts = await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      }).then(() => 
        window.ethereum.request({ method: 'eth_requestAccounts' })
      );
      setAccount(accounts[0]);
      return accounts[0];
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const provider = useMemo(() => {
    return window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null;
  }, []);

  const donate = useCallback(async (ethAmount: string) => {
    if (!provider || !account) {
      throw new Error('Wallet not connected');
    }

    const signer = await provider.getSigner();
    const contract = new ethers.Contract(DONATION_CONTRACT_ADDRESS, DONATION_CONTRACT_ABI, signer);

    const tx = await contract.donate({
      value: ethers.parseEther(ethAmount)
    });

    return tx;
  }, [provider, account]);

  const getUSDAmount = useCallback(async (ethAmount: string) => {
    if (!provider) {
      throw new Error('MetaMask not installed');
    }

    const contract = new ethers.Contract(DONATION_CONTRACT_ADDRESS, DONATION_CONTRACT_ABI, provider);
    
    const usdAmount = await contract.ethToUSD(ethers.parseEther(ethAmount));
    return parseFloat(ethers.formatEther(usdAmount));
  }, [provider]);

  const disconnectWallet = useCallback(() => {
    setAccount('');
  }, []);

  const withdraw = useCallback(async () => {
    if (!provider || !account) {
      throw new Error('Wallet not connected');
    }

    const signer = await provider.getSigner();
    const contract = new ethers.Contract(DONATION_CONTRACT_ADDRESS, DONATION_CONTRACT_ABI, signer);

    const tx = await contract.withdraw();
    return tx;
  }, [provider, account]);

  return {
    account,
    isConnecting,
    connectWallet,
    disconnectWallet,
    donate,
    getUSDAmount,
    withdraw
  };
};

declare global {
  interface Window {
    ethereum?: any;
  }
}