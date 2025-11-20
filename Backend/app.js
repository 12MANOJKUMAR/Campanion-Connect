import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { initSocket } from './utils/socket.js';
import {conn} from './conn/conn.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import interestsRoutes from './routes/interestsRoutes.js';
import usersInterestsRoutes from './routes/usersInterestsRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import connectionRequestRoutes from './routes/connectionRequestRoutes.js';

// Load env variables
dotenv.config();

// Connect to database
conn();

const app = express();
const server = createServer(app);
const port = process.env.PORT || 5000; // Changed to 5000 to match API calls

// Initialize Socket.io
initSocket(server);

// --- Core Middleware ---

// 1. CORS Configuration
// This is crucial for allowing your React app (on a different port)
// to communicate with this backend.
app.use(cors({
  origin: 'http://localhost:5173', // Your React app's address
  credentials: true, // This allows cookies to be sent
}));

// 2. Body Parsers
// Allow us to accept JSON data in the request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Cookie Parser
// Allows us to read cookies from the request
app.use(cookieParser());


// --- API Routes ---
// All auth routes will be prefixed with /api/auth
app.use('/api/auth', authRoutes);
// All user routes will be prefixed with /api/users
app.use('/api/users', userRoutes);
// All interests routes will be prefixed with /api/interests
app.use('/api/interests', interestsRoutes);
// Users interests routes - also prefixed with /api/users
app.use('/api/users', usersInterestsRoutes);
// Profile routes
app.use('/api/user', profileRoutes);
// Message routes
app.use('/api/messages', messageRoutes);
// Connection request routes
app.use('/api/connections', connectionRequestRoutes);


// --- Error Handling Middleware ---
// These must be *after* your routes
app.use(notFound); // Handles 404 errors
app.use(errorHandler); // Handles all other errors


server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
