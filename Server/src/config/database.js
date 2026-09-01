import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const RETRY_DELAY_MS = 10000;

const sanitizeMongoUri = (uri) => {
  if (!uri) return '';
  return uri.replace(/:\/\/([^:]+):([^@]+)@/, '://****:****@');
};

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const localUri = process.env.MONGODB_URI_LOCAL || 'mongodb://127.0.0.1:27017/grocery_management';

  try {
    const mongoUri = primaryUri || localUri;
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    
    console.log(`✅ MongoDB Connected Successfully (${sanitizeMongoUri(mongoUri)})`);
  } catch (error) {
    console.error(`❌ Primary MongoDB connection failed: ${error.message}`);
    
    // If primary was not the local URI, attempt local fallback immediately
    if (primaryUri && primaryUri !== localUri) {
      console.log(`🔄 Attempting fallback connection to local MongoDB: ${localUri}...`);
      try {
        await mongoose.connect(localUri, {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000
        });
        console.log(`✅ Connected to Local MongoDB fallback successfully!`);
        return;
      } catch (fallbackError) {
        console.error(`❌ Fallback MongoDB connection failed: ${fallbackError.message}`);
      }
    }

    console.log(`🔁 Retrying MongoDB connection in ${RETRY_DELAY_MS / 1000}s...`);
    setTimeout(() => {
      connectDB();
    }, RETRY_DELAY_MS);
  }
};

export default connectDB;
