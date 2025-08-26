import { ethers } from 'ethers';
import { logger } from '../utils/logger.js';

const SEPOLIA_RPC = process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID';
const CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY;

// Simple ABI for donation function
const CONTRACT_ABI = [
  "function donateAndMint(string deviceId, string transactionId, string ipfsCID, bytes32 dataHash) external payable returns (uint256)",
  "function donations(address) external view returns (uint256)",
  "event DeviceMinted(uint256 indexed tokenId, string deviceId, string transactionId, string ipfsCID, bytes32 dataHash)"
];

export const createDonation = async (req, res) => {
  try {
    const { donorAddress, amount, deviceId, ipfsCID, dataHash } = req.body;
    
    if (!donorAddress || !amount || !deviceId || !ipfsCID || !dataHash) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate unique transaction ID
    const transactionId = `donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Connect to Sepolia
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
    
    // Call donateAndMint function
    const tx = await contract.donateAndMint(
      deviceId,
      transactionId,
      ipfsCID,
      ethers.keccak256(ethers.toUtf8Bytes(dataHash)),
      { value: ethers.parseEther(amount.toString()) }
    );
    
    logger.info('Donation transaction sent', { txHash: tx.hash, donorAddress, amount });
    
    res.json({
      success: true,
      transactionHash: tx.hash,
      transactionId,
      message: 'Donation submitted, NFT will be minted upon confirmation'
    });
    
  } catch (error) {
    logger.error('Donation failed', error, { donorAddress: req.body.donorAddress });
    res.status(500).json({ error: 'Donation processing failed' });
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