import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  sendConnectionRequest,
  getConnectionRequests,
  respondToRequest,
  getSentRequests,
  getNotifications,
  getConnections,
  checkRequestStatus,
  withdrawRequest,
  disconnectConnection,
} from '../controllers/connectionRequestController.js';

const router = express.Router();

// POST /api/connections/send - Send connection request
router.post('/send', protect, sendConnectionRequest);

// GET /api/connections/requests - Get pending requests for current user
router.get('/requests', protect, getConnectionRequests);

// GET /api/connections/sent - Get sent requests (My Requests)
router.get('/sent', protect, getSentRequests);

// GET /api/connections/notifications - Get notifications (pending requests received)
router.get('/notifications', protect, getNotifications);

// GET /api/connections/list - Get connections (accepted requests)
router.get('/list', protect, getConnections);

// PUT /api/connections/respond/:requestId - Accept or reject request
router.put('/respond/:requestId', protect, respondToRequest);

// GET /api/connections/check/:receiverId - Check request status for a user
router.get('/check/:receiverId', protect, checkRequestStatus);

// DELETE /api/connections/withdraw/:requestId - Withdraw a pending request
router.delete('/withdraw/:requestId', protect, withdrawRequest);

// DELETE /api/connections/disconnect/:connectionId - Disconnect an accepted connection
router.delete('/disconnect/:connectionId', protect, disconnectConnection);

export default router;

