import express from 'express';
import { registerUser, loginUser, logoutUser, getMe, updateCredentials } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload, uploadProfilePicture } from '../middleware/uploadMiddleware.js';
const router = express.Router();


router.post('/register', upload.single('profilePicture'), uploadProfilePicture, registerUser);


router.post('/login', loginUser);


router.post('/logout', logoutUser);

// Verify token and return current user
router.get('/me', protect, getMe);

// Update credentials for current user
router.put('/credentials', protect, updateCredentials);

export default router;
