import express from 'express';
import { getUsersByInterest, myCompanions, exploreCompanions, getUserById } from '../controllers/usersInterestsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/users/mycompanions - My Companion (only accepted connections)
router.get('/mycompanions', protect, myCompanions);

// GET /api/users/explore - Explore (all users with matching interests)
router.get('/explore', protect, exploreCompanions);

// GET /api/users/interested-in/:interestName - Get users by interest (protected, excludes logged-in user)
router.get('/interested-in/:interestName', protect, getUsersByInterest);

// GET /api/users/:id - Get user by ID (protected) - MUST be last to avoid route conflicts
router.get('/:id', protect, getUserById);

export default router;

