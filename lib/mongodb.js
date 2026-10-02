import { MongoClient } from 'mongodb';

/**
 * Parses and safely encodes username and password in MongoDB URIs
 * to correctly handle passwords with URL-reserved characters (@, :, /, ?, #, %, etc.)
 */
export function sanitizeMongoUri(rawUri) {
  if (!rawUri || typeof rawUri !== 'string') return '';
  const trimmed = rawUri.trim();

  // Match: mongodb+srv://username:password@host/database?options
  const match = trimmed.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):(.*)@([^/?#]+)(.*)$/);
  if (match) {
    const [, protocol, user, pass, host, rest] = match;
    // Decode first in case parts were partially encoded, then encode properly
    const safeUser = encodeURIComponent(decodeURIComponent(user));
    const safePass = encodeURIComponent(decodeURIComponent(pass));
    return `${protocol}${safeUser}:${safePass}@${host}${rest}`;
  }

  return trimmed;
}

/**
 * Strip passwords from connection string for safe server logging
 */
export function redactMongoUri(uri) {
  if (!uri) return '';
  return uri.replace(/^(mongodb(?:\+srv)?:\/\/)([^:]+):(.*)@/i, '$1$2:***@');
}

const clientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 15000, // 15 seconds to accommodate serverless cold starts
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true,
};

let client;
let clientPromise;

/**
 * Returns a connected MongoClient instance, reusing connections across
 * serverless function invocations to prevent connection pool exhaustion on Atlas.
 */
export async function getMongoClient() {
  const rawUri = process.env.MONGODB_URI;
  if (!rawUri) {
    const err = new Error('MONGODB_URI environment variable is not defined in the server environment.');
    err.code = 'CONFIG_MISSING';
    throw err;
  }

  const safeUri = sanitizeMongoUri(rawUri);

  if (!global._mongoClientPromise) {
    client = new MongoClient(safeUri, clientOptions);
    global._mongoClientPromise = client.connect().catch((err) => {
      // Clear global promise on connection failure so the next request can retry fresh
      global._mongoClientPromise = null;
      throw err;
    });
  }

  return global._mongoClientPromise;
}

/**
 * Returns the portfolio database instance.
 * Automatically extracts the database name from the URI if specified, or defaults to 'portfolio'.
 */
export async function getDatabase(defaultDb = 'portfolio') {
  const client = await getMongoClient();

  const rawUri = process.env.MONGODB_URI || '';
  let targetDb = defaultDb;

  // Extract database name from connection string if present (e.g. mongodb.net/portfolio?...)
  const dbMatch = rawUri.match(/mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/);
  if (dbMatch && dbMatch[1] && dbMatch[1].trim() !== '') {
    targetDb = dbMatch[1].trim();
  }

  return client.db(targetDb);
}

// Next.js standard clientPromise export
if (process.env.MONGODB_URI) {
  const safeUri = sanitizeMongoUri(process.env.MONGODB_URI);
  if (!global._mongoClientPromise) {
    client = new MongoClient(safeUri, clientOptions);
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
