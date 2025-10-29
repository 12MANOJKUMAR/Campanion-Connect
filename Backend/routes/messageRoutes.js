import express from 'express';
import { sendMessage, getChatHistory, upload } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/messages/send - Send a message (with optional image upload)
router.post('/send', protect, upload.single('image'), sendMessage);

// GET /api/messages/:senderId/:receiverId - Get chat history
router.get('/:senderId/:receiverId', protect, getChatHistory);

export default router;

