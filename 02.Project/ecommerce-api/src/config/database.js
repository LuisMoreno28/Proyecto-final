import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbConnection = async () => {
  try {
    const dbURI = process.env.MONGODB_URI;

    await mongoose.connect(dbURI);

    console.log('MongoDB is connected');
    console.log('dbURI:', process.env.MONGODB_URI);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default dbConnection;