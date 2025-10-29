import express from 'express';
import { registerUser, loginUser, logoutUser, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();


router.post('/register', registerUser);


router.post('/login', loginUser);


router.post('/logout', logoutUser);

// Verify token and return current user
router.get('/me', protect, getMe);

export default router;
