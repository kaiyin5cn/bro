import { MongoClient } from 'mongodb';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const REPLICA_SET_NAME = 'urlshortener-rs';
const PORTS = [27017, 27018, 27019];
const DATA_DIRS = ['data/rs0', 'data/rs1', 'data/rs2'];

async function waitForMongoDB(port, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const client = new MongoClient(`mongodb://localhost:${port}`);
      await client.connect();
      await client.close();
      return true;
    } catch {
      await sleep(1000);
    }
  }
  throw new Error(`MongoDB on port ${port} not ready after ${maxAttempts} attempts`);
}

export async function setupReplicaSet() {
  console.log('🔄 Setting up MongoDB Replica Set...');
  
  // Create data directories
  for (const dir of DATA_DIRS) {
    await execAsync(`mkdir ${dir}`).catch(() => {});
  }
  
  // Start MongoDB instances
  for (let i = 0; i < PORTS.length; i++) {
    const cmd = `mongod --replSet ${REPLICA_SET_NAME} --port ${PORTS[i]} --dbpath ${DATA_DIRS[i]} --oplogSize 128 --fork --logpath ${DATA_DIRS[i]}/mongod.log`;
    try {
      await execAsync(cmd);
      console.log(`✅ MongoDB instance started on port ${PORTS[i]}`);
    } catch (error) {
      console.log(`⚠️  Failed to start MongoDB on port ${PORTS[i]}:`, error.message);
      console.log('   Please ensure MongoDB is installed and mongod is in PATH');
      process.exit(1);
    }
  }
  
  // Wait for instances
  try {
    for (const port of PORTS) {
      await waitForMongoDB(port);
    }
  } catch (error) {
    console.log('❌ MongoDB instances not ready:', error.message);
    process.exit(1);
  }
  
  // Initialize replica set
  const client = new MongoClient(`mongodb://localhost:${PORTS[0]}`);
  try {
    await client.connect();
    
    const config = {
      _id: REPLICA_SET_NAME,
      members: PORTS.map((port, i) => ({
        _id: i,
        host: `localhost:${port}`,
        priority: i === 0 ? 2 : 1
      }))
    };
    
    try {
      await client.db('admin').command({ replSetInitiate: config });
      console.log('✅ Replica set initialized');
    } catch (error) {
      if (!error.message.includes('already initialized')) {
        console.log('❌ Replica set initialization failed:', error.message);
        await client.close();
        process.exit(1);
      }
      console.log('ℹ️  Replica set already initialized');
    }
    
    await client.close();
  } catch (error) {
    console.log('❌ Failed to connect to MongoDB for replica set setup:', error.message);
    process.exit(1);
  }
  await sleep(5000);
  return `mongodb://localhost:${PORTS.join(',localhost:')}/?replicaSet=${REPLICA_SET_NAME}`;
}

export async function createDatabaseUser(mongoUri, dbName, appUser, appPassword) {
  const client = new MongoClient(mongoUri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000
  });
  await client.connect();
  
  const appDb = client.db(dbName);
  
  try {
    await appDb.command({
      createUser: appUser,
      pwd: appPassword,
      roles: [{ role: 'readWrite', db: dbName }]
    });
    console.log('✅ Database user created');
  } catch (error) {
    if (error.code === 11000) {
      console.log('ℹ️  Database user already exists');
    } else {
      throw error;
    }
  }
  
  await client.close();
}