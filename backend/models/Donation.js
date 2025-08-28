import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorAddress: {
    type: String,
    required: [true, 'Donor address is required'],
    trim: true,
    index: true
  },
  amount: {
    type: Number,
    required: [true, 'Donation amount is required'],
    min: [0, 'Amount has to be more than 0']
  },
  transactionHash: {
    type: String,
    required: [true, 'Transaction hash is required'],
    unique: true,
    index: true
  },
  nftTokenId: {
    type: Number,
    default: null
  },
  nftMinted: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export default mongoose.model('Donation', donationSchema);