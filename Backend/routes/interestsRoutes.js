import express from 'express';
import { getAllInterests, getUserInterests } from '../controllers/interestsController.js';

const router = express.Router();

// GET /api/interests/all
router.get('/all', getAllInterests);

// GET /api/interests/user/:id
router.get('/user/:id', getUserInterests);

export default router;

