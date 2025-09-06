import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
  try {
    const options = {
      maxPoolSize: 500,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}