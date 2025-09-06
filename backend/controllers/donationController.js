import { ethers } from 'ethers';
import { logger } from '../utils/logger.js';
import Donation from '../models/Donation.js';

const SEPOLIA_RPC = process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID';
const CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS || '0xD8462e0A1a78E8ac07e0A414B5539680689071C8';
const PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY;
// Donation contract ABI
const DONATION_CONTRACT_ABI = [
  "function donate() external payable",
  "function getDonationHistory(address donor) external view returns (tuple(uint256,uint256,uint256,bool,uint256)[])",
  "function ethToUSD(uint256 ethAmount) external view returns (uint256)",
  "event DonationReceived(address indexed donor, uint256 ethAmount, uint256 usdAmount, bool nftMinted, uint256 tokenId)"
];

export const trackDonation = async (req, res) => {
  try {
    const { transactionHash, donorAddress, ethAmount, usdAmount } = req.body;
    
    if (!transactionHash || !donorAddress || !ethAmount || !usdAmount) {
      return res.status(400).json({ error: 'Transaction hash, donor address, ETH amount, and USD amount are required' });
    }

    // Save donation to database
    const donation = new Donation({
      donorAddress,
      amount: usdAmount,
      transactionHash,
      status: 'confirmed',
      nftMinted: usdAmount >= 100
    });
    
    await donation.save();
    
    logger.info('Donation tracked', { transactionHash, donorAddress, ethAmount, usdAmount });
    
    res.json({
      success: true,
      message: 'Donation tracked successfully'
    });
    
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Transaction already tracked' });
    }
    logger.error('Donation tracking failed', error, { transactionHash: req.body.transactionHash });
    res.status(500).json({ error: 'Donation tracking failed' });
  }
};

export const getDonationStatus = async (req, res) => {
  try {
    const { txHash } = req.params;
    
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
      return res.json({ status: 'pending' });
    }
    
    res.json({
      status: receipt.status === 1 ? 'confirmed' : 'failed',
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    });
    
  } catch (error) {
    logger.error('Status check failed', error, { txHash: req.params.txHash });
    res.status(500).json({ error: 'Status check failed' });
  }
};

export const getDonationHistory = async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address format' });
    }
    
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, DONATION_CONTRACT_ABI, provider);
    
    // Get donation history from contract
    const contractHistory = await contract.getDonationHistory(address);
    
    const donations = contractHistory.map((donation) => ({
      ethAmount: ethers.formatEther(donation[0]),
      usdAmount: parseFloat(ethers.formatEther(donation[1])),
      timestamp: Number(donation[2]),
      nftMinted: donation[3],
      tokenId: donation[3] ? Number(donation[4]) : null
    }));
    
    res.json({
      success: true,
      donations
    });
    
  } catch (error) {
    logger.error('Donation history fetch failed', error, { address: req.params.address });
    res.status(500).json({ error: 'Failed to fetch donation history' });
  }
};

