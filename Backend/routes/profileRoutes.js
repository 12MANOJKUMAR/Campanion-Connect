import express from 'express';
import { updateProfile, updateVisibility } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// PUT /api/user/update/:id - Update user profile
router.put('/update/:id', protect, updateProfile);

// PUT /api/user/visibility/:id - Update visibility settings
router.put('/visibility/:id', protect, updateVisibility);

export default router;

