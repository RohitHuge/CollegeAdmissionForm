import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/index.js';
import ocrTestRoutes from './routes/ocrTest.routes.js';
import formsRoutes from './routes/form.routes.js';

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());


// import registrationRoutes from './routes.js';
// Routes
app.use('/api', ocrTestRoutes);
app.use('/api/forms', formsRoutes);

// Database connection
connectDB()
    .then(() => {
        console.log('✅ Database connected successfully')
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch(err => console.error('❌ Database connection error:', err.message));