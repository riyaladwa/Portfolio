import { MongoClient } from 'mongodb';

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
};

let client;
let clientPromise;

/**
 * Returns a connected MongoClient instance, reusing existing connections across
 * serverless function invocations to prevent connection exhaustion on MongoDB Atlas.
 */
export async function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in server environment variables.');
  }

  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      // Clear cached promise on connection error so subsequent requests can retry
      global._mongoClientPromise = null;
      throw err;
    });
  }

  return global._mongoClientPromise;
}

/**
 * Helper to get a specific MongoDB database instance (defaults to 'portfolio').
 */
export async function getDatabase(dbName = 'portfolio') {
  const client = await getMongoClient();
  return client.db(dbName);
}

// For legacy / standard Next.js mongodb pattern compatibility:
if (process.env.MONGODB_URI) {
  if (!global._mongoClientPromise) {
    client = new MongoClient(process.env.MONGODB_URI, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      global._mongoClientPromise = null;
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = null;
}

export default clientPromise;
