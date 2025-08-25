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
    } catch {
      console.log(`ℹ️  MongoDB instance on port ${PORTS[i]} may already be running`);
    }
  }
  
  // Wait for instances
  for (const port of PORTS) {
    await waitForMongoDB(port);
  }
  
  // Initialize replica set
  const client = new MongoClient(`mongodb://localhost:${PORTS[0]}`);
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
    if (!error.message.includes('already initialized')) throw error;
    console.log('ℹ️  Replica set already initialized');
  }
  
  await client.close();
  await sleep(5000);
  return `mongodb://localhost:${PORTS.join(',localhost:')}/?replicaSet=${REPLICA_SET_NAME}`;
}

export async function createDatabaseUser(mongoUri, dbName, appUser, appPassword) {
  const client = new MongoClient(mongoUri);
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