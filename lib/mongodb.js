import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
};

let client;
let clientPromise;

if (!uri) {
  console.warn('⚠️ MONGODB_URI is not defined in environment variables. Database persistence will be skipped.');
  clientPromise = null;
} else {
  // In serverless environments (like Vercel), use global caching across warm function invocations
  // to prevent connection pool exhaustion on MongoDB Atlas.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}

export default clientPromise;

