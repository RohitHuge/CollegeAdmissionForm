import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/index.js';

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());


// Database connection
connectDB()
    .then(() => {
        console.log('✅ Database connected successfully')
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch(err => console.error('❌ Database connection error:', err.message));


// import registrationRoutes from './routes.js';
// // Routes
// app.use('/api',registrationRoutes);