import mongo from 'mongoose';
// import { DB_NAME, MONGODB_URL } from '../config.js';

const connectDB = async () => {
  try {
    // console.log(process.env.MONGODB_URL);
    await mongo.connect(`${process.env.MONGODB_URL}`);
    console.log(`MongoDB connected to ${process.env.DB_NAME}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
}

export { connectDB };