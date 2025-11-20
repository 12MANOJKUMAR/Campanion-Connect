import express from 'express';
import { updateProfile, updateVisibility } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload, uploadProfilePicture } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// PUT /api/user/update/:id - Update user profile
router.put('/update/:id', protect, upload.single('profilePicture'), uploadProfilePicture, updateProfile);

// PUT /api/user/visibility/:id - Update visibility settings
router.put('/visibility/:id', protect, updateVisibility);

export default router;

