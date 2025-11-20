import asyncHandler from 'express-async-handler';
import ConnectionRequest from '../models/ConnectionRequest.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// --- Send Connection Request ---
export const sendConnectionRequest = asyncHandler(async (req, res) => {
  const senderId = req.user._id; // From protect middleware
  const { receiverId } = req.body;

  // Validate receiverId
  if (!receiverId) {
    res.status(400);
    throw new Error('Receiver ID is required');
  }

  // Check if receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent self-requests
  if (senderId.toString() === receiverId) {
    res.status(400);
    throw new Error('Cannot send request to yourself');
  }

  // Check if request already exists
  const existingRequest = await ConnectionRequest.findOne({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId }, // Check both directions
    ],
  });

  if (existingRequest) {
    if (existingRequest.status === 'pending') {
      res.status(400);
      throw new Error('Request already sent');
    }
    if (existingRequest.status === 'accepted') {
      res.status(400);
      throw new Error('Already connected');
    }
  }

  // Create new request
  const connectionRequest = await ConnectionRequest.create({
    senderId,
    receiverId,
    status: 'pending',
  });

  // Create notification for the receiver
  await Notification.create({
    userId: receiverId, // Notify the receiver
    type: 'connection_request',
    relatedUserId: senderId, // The user who sent the request
    connectionRequestId: connectionRequest._id,
    read: false,
  });

  res.status(201).json({
    success: true,
    message: 'Request sent successfully',
    data: connectionRequest,
  });
});

// --- Get Connection Requests (for a user) ---
export const getConnectionRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const requests = await ConnectionRequest.find({
    receiverId: userId,
    status: 'pending',
  })
    .populate('senderId', 'fullName profilePicture location interests')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests,
  });
});

// --- Accept/Reject Connection Request ---
export const respondToRequest = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { requestId } = req.params;
  const { action } = req.body; // 'accept' or 'reject'

  if (!['accept', 'reject'].includes(action)) {
    res.status(400);
    throw new Error('Action must be either "accept" or "reject"');
  }

  const request = await ConnectionRequest.findById(requestId);

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  if (request.receiverId.toString() !== userId.toString()) {
    res.status(403);
    throw new Error('Not authorized to respond to this request');
  }

  if (request.status !== 'pending') {
    res.status(400);
    throw new Error('Request has already been responded to');
  }

  request.status = action === 'accept' ? 'accepted' : 'rejected';
  await request.save();

  // If request is accepted, create a notification for the sender
  if (action === 'accept') {
    await Notification.create({
      userId: request.senderId, // Notify the sender that their request was accepted
      type: 'connection_accepted',
      relatedUserId: userId, // The user who accepted the request
      connectionRequestId: request._id,
      read: false,
    });
  }

  res.status(200).json({
    success: true,
    message: `Request ${action}ed successfully`,
    data: request,
  });
});

// Helper function to group by date (Today, Yesterday, Older)
const groupByDate = (items) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const grouped = {
    today: [],
    yesterday: [],
    older: []
  };

  items.forEach(item => {
    const itemDate = new Date(item.createdAt || item.updatedAt);
    itemDate.setHours(0, 0, 0, 0);
    
    if (itemDate.getTime() === today.getTime()) {
      grouped.today.push(item);
    } else if (itemDate.getTime() === yesterday.getTime()) {
      grouped.yesterday.push(item);
    } else {
      grouped.older.push(item);
    }
  });

  return grouped;
};

// Helper function to format date for older items
const formatDate = (date) => {
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
};

// --- Get Sent Requests (My Requests) ---
export const getSentRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const requests = await ConnectionRequest.find({
    senderId: userId,
  })
    .populate('receiverId', 'fullName profilePicture location interests')
    .sort({ createdAt: -1 });

  // Group by date
  const grouped = groupByDate(requests);

  // Format older items with dates
  const formattedOlder = grouped.older.map(item => ({
    ...item.toObject(),
    formattedDate: formatDate(item.createdAt)
  }));

  res.status(200).json({
    success: true,
    data: {
      today: grouped.today,
      yesterday: grouped.yesterday,
      older: formattedOlder,
    },
    count: requests.length,
  });
});

// --- Get Notifications (Pending Requests Received + Connection Accepted) ---
export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get pending connection requests (requests received)
  const pendingRequests = await ConnectionRequest.find({
    receiverId: userId,
    status: 'pending',
  })
    .populate('senderId', 'fullName profilePicture location interests')
    .sort({ createdAt: -1 });

  // Get acceptance notifications (when user's sent request was accepted)
  const acceptanceNotifications = await Notification.find({
    userId: userId,
    type: 'connection_accepted',
    read: false,
  })
    .populate('relatedUserId', 'fullName profilePicture location interests')
    .populate('connectionRequestId')
    .sort({ createdAt: -1 })
    .limit(50);

  // Format notifications for frontend
  const formattedNotifications = [
    // Pending requests (connection_request type)
    ...pendingRequests.map(req => ({
      _id: req._id,
      type: 'connection_request',
      senderId: req.senderId,
      createdAt: req.createdAt,
      connectionRequestId: req._id,
    })),
    // Acceptance notifications (connection_accepted type)
    ...acceptanceNotifications.map(notif => ({
      _id: notif._id,
      type: 'connection_accepted',
      senderId: notif.relatedUserId, // The user who accepted
      createdAt: notif.createdAt,
      connectionRequestId: notif.connectionRequestId,
      notificationId: notif._id, // For marking as read
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 50);

  res.status(200).json({
    success: true,
    count: formattedNotifications.length,
    data: formattedNotifications,
  });
});

// --- Get Connections (Accepted Requests) ---
export const getConnections = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const connections = await ConnectionRequest.find({
    status: 'accepted',
    $or: [
      { senderId: userId },
      { receiverId: userId },
    ],
  })
    .populate('senderId', 'fullName profilePicture location interests')
    .populate('receiverId', 'fullName profilePicture location interests')
    .sort({ updatedAt: -1 }); // Sort by when connection was accepted (updatedAt)

  // Get the other user (not the logged-in user) for each connection
  const formattedConnections = connections.map(conn => {
    const otherUser = conn.senderId._id.toString() === userId.toString() 
      ? conn.receiverId 
      : conn.senderId;
    
    return {
      _id: conn._id,
      user: otherUser,
      connectedAt: conn.updatedAt, // When it was accepted
      createdAt: conn.createdAt, // When request was sent
    };
  });

  // Group by date
  const grouped = groupByDate(formattedConnections.map(c => ({ ...c, createdAt: c.connectedAt })));

  // Format older items with dates
  const formattedOlder = grouped.older.map(item => ({
    ...item,
    formattedDate: formatDate(item.connectedAt)
  }));

  res.status(200).json({
    success: true,
    data: {
      today: grouped.today,
      yesterday: grouped.yesterday,
      older: formattedOlder,
    },
    count: formattedConnections.length,
  });
});

// --- Check Request Status (for a specific user) ---
export const checkRequestStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { receiverId } = req.params;

  if (!receiverId) {
    res.status(400);
    throw new Error('Receiver ID is required');
  }

  // Check if there's a pending request from current user to this receiver
  const pendingRequest = await ConnectionRequest.findOne({
    senderId: userId,
    receiverId,
    status: 'pending',
  });

  // Check if already connected
  const connection = await ConnectionRequest.findOne({
    status: 'accepted',
    $or: [
      { senderId: userId, receiverId },
      { senderId: receiverId, receiverId: userId },
    ],
  });

  res.status(200).json({
    success: true,
    data: {
      pendingRequest: pendingRequest ? {
        _id: pendingRequest._id,
        status: pendingRequest.status,
        createdAt: pendingRequest.createdAt,
      } : null,
      isConnected: !!connection,
    },
  });
});

// --- Withdraw Connection Request ---
export const withdrawRequest = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { requestId } = req.params;

  const request = await ConnectionRequest.findById(requestId);

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  // Ensure the logged-in user is the sender of the request
  if (request.senderId.toString() !== userId.toString()) {
    res.status(403);
    throw new Error('Not authorized to withdraw this request');
  }

  // Only allow withdrawing pending requests
  if (request.status !== 'pending') {
    res.status(400);
    throw new Error('Can only withdraw pending requests');
  }

  await ConnectionRequest.findByIdAndDelete(requestId);

  res.status(200).json({
    success: true,
    message: 'Request withdrawn successfully',
  });
});

// --- Disconnect (Remove Connection) ---
export const disconnectConnection = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { connectionId } = req.params;

  const connection = await ConnectionRequest.findById(connectionId);

  if (!connection) {
    res.status(404);
    throw new Error('Connection not found');
  }

  // Ensure the logged-in user is part of this connection
  const isSender = connection.senderId.toString() === userId.toString();
  const isReceiver = connection.receiverId.toString() === userId.toString();

  if (!isSender && !isReceiver) {
    res.status(403);
    throw new Error('Not authorized to disconnect this connection');
  }

  // Only allow disconnecting accepted connections
  if (connection.status !== 'accepted') {
    res.status(400);
    throw new Error('Can only disconnect accepted connections');
  }

  // Delete the connection request
  await ConnectionRequest.findByIdAndDelete(connectionId);

  res.status(200).json({
    success: true,
    message: 'Connection disconnected successfully',
  });
});

