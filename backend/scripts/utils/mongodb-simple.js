import { MongoClient } from 'mongodb';
import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';

const execAsync = promisify(exec);

export async function setupMongoDB(useReplica = false) {
  console.log(`🔧 Setting up MongoDB${useReplica ? ' Replica Set' : ''}...`);
  
  if (useReplica) {
    // Create replica set directories
    console.log('📁 Creating replica set directories...');
    await execAsync('mkdir data\\rs0 data\\logs').catch(() => {
      console.log('ℹ️  Directories already exist');
    });
    
    // Start MongoDB with replica config
    try {
      await execAsync('mongod --config config/mongodb-replica.cfg');
      console.log('✅ MongoDB replica set started');
      
      // Initialize replica set with timeout
      await new Promise(resolve => setTimeout(resolve, 3000));
      const client = new MongoClient('mongodb://localhost:27017', {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000
      });
      
      const connectTimeout = setTimeout(() => {
        throw new Error('MongoDB connection timeout after 10 seconds');
      }, 10000);
      
      await client.connect();
      clearTimeout(connectTimeout);
      
      try {
        await client.db('admin').command({
          replSetInitiate: {
            _id: 'urlshortener-rs',
            members: [{ _id: 0, host: 'localhost:27017' }]
          }
        });
        console.log('✅ Replica set initialized');
      } catch (error) {
        if (!error.message.includes('already initialized')) {
          throw error;
        }
        console.log('ℹ️  Replica set already initialized');
      }
      
      await client.close();
    } catch (error) {
      console.log('⚠️  Replica setup failed:', error.message);
      throw error;
    }
  } else {
    // Create data directories
    console.log('📁 Creating data directories...');
    await execAsync('mkdir data\\db data\\logs').catch(() => {
      console.log('ℹ️  Directories already exist');
    });
    
    // Start MongoDB with config file
    try {
      await execAsync('mongod --config config/mongodb.cfg');
      console.log('✅ MongoDB started with configuration file');
    } catch (error) {
      console.log('⚠️  MongoDB may already be running or config failed');
    }
  }
  
  // Test connection with timeout
  const client = new MongoClient('mongodb://localhost:27017', {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000
  });
  
  try {
    await client.connect();
    console.log('✅ MongoDB connection verified');
    await client.close();
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
}