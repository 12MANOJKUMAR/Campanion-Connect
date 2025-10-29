import express from 'express';
import { getUsersByInterest, myCompanions } from '../controllers/usersInterestsController.js';

const router = express.Router();

// GET /api/users/interested-in/:interestName
router.get('/interested-in/:interestName', getUsersByInterest);

router.get('/mycompanions', myCompanions);

export default router;

