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
// Allow local dev (Vite) and deployed frontend (env override supported)
const defaultOrigins = [
  // Frontend deployments
  'https://campanion-connect.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  // Backend deployments (for tools hitting APIs from same origin)
  'https://campanion-connect.onrender.com',
  'http://localhost:5000',
];

const envOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',').map((url) => url.trim())
  : [];

const allowedOrigins = Array.from(new Set([...envOrigins, ...defaultOrigins]));

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// 2. Body Parsers
// Allow us to accept JSON data in the request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Cookie Parser
// Allows us to read cookies from the request
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});



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
