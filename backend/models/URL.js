import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  longURL: { 
    type: String, 
    required: [true, 'Long URL is required'],
    trim: true,
    index: true
  },
  shortCode: { 
    type: String, 
    required: [true, 'Short code is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^[0-9a-zA-Z]{7}$/.test(v);
      },
      message: 'Short code must be exactly 7 alphanumeric characters'
    },
    index: true
  },
  accessCount: { 
    type: Number, 
    default: 0, 
    min: [0, 'Access count cannot be negative']
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// TTL index - expire documents 7 days after last update
urlSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 604800 });

export default mongoose.models.Url || mongoose.model('Url', urlSchema);