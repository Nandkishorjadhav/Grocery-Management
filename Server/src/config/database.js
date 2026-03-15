import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const RETRY_DELAY_MS = 10000;

const sanitizeMongoUri = (uri) => {
  if (!uri) return '';
  return uri.replace(/:\/\/([^:]+):([^@]+)@/, '://****:****@');
};

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });
    
    console.log(`✅ MongoDB Connected Successfully`);
  } catch (error) {
    const currentUri = process.env.MONGODB_URI ;
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.error(`⚠️ Using MONGODB_URI: ${sanitizeMongoUri(currentUri) || 'NOT SET'}`);
    console.log(`🔁 Retrying MongoDB connection in ${RETRY_DELAY_MS / 1000}s...`);

    setTimeout(() => {
      connectDB();
    }, RETRY_DELAY_MS);
  }
};

export default connectDB;
