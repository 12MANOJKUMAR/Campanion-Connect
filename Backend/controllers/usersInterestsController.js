import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import ConnectionRequest from '../models/ConnectionRequest.js';
import mongoose from 'mongoose';

// --- Get Users by Interest ---
// Returns all users who have the specified interest (excluding logged-in user)
const getUsersByInterest = asyncHandler(async (req, res) => {
  const { interestName } = req.params;

  if (!interestName) {
    res.status(400);
    throw new Error('Interest name is required');
  }

  // Get logged-in user ID from protect middleware (if authenticated)
  const currentUserId = req.user?._id;

  // Build query to find users with this interest
  const query = {
    interests: { $in: [interestName] }
  };

  // Exclude logged-in user if authenticated
  if (currentUserId) {
    query._id = { $ne: currentUserId };
  }

  // Find all users with this interest in their interests array
  const users = await User.find(query)
    .select('fullName email location profilePicture interests bio')
    .limit(50);

  res.status(200).json({
    success: true,
    data: users,
    count: users.length
  });
});

const myCompanions = asyncHandler(async (req, res) => {
  const { interests } = req.query;

  // Validate query
  if (!interests) {
    res.status(400);
    throw new Error('Interests query parameter is required');
  }

  // Get logged-in user ID from protect middleware
  const currentUserId = req.user?._id;
  if (!currentUserId) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Convert comma-separated string into an array
  const interestArray = interests.split(',').map(interest => interest.trim());

  // Get all accepted connection requests where current user is either sender or receiver
  const acceptedConnections = await ConnectionRequest.find({
    status: 'accepted',
    $or: [
      { senderId: currentUserId },
      { receiverId: currentUserId },
    ],
  }).select('senderId receiverId');

  // Extract all connected user IDs (as ObjectIds)
  const connectedUserIds = acceptedConnections.map(conn => {
    return conn.senderId.toString() === currentUserId.toString()
      ? conn.receiverId
      : conn.senderId;
  });

  // If no connections, return empty
  if (connectedUserIds.length === 0) {
    return res.status(200).json({
      success: true,
      count: 0,
      companions: [],
      message: 'No accepted connections found',
    });
  }

  // Fetch users who:
  // 1. Have at least one matching interest
  // 2. Are in the connected users list (accepted connection)
  // 3. Are not the logged-in user
  const users = await User.find({
    _id: { $in: connectedUserIds }, // Only users with accepted connections
    interests: { $in: interestArray },
  }).select('fullName profilePicture location interests');

  // If no users found
  if (!users.length) {
    return res.status(200).json({
      success: true,
      count: 0,
      companions: [],
      message: 'No companions found with these interests',
    });
  }

  // Return result
  res.status(200).json({
    success: true,
    count: users.length,
    companions: users,
  });
});

// --- Explore Companions (All users with matching interests, NOT filtered by connections) ---
const exploreCompanions = asyncHandler(async (req, res) => {
  const { interests } = req.query;

  // Validate query
  if (!interests) {
    res.status(400);
    throw new Error('Interests query parameter is required');
  }

  // Get logged-in user ID from protect middleware
  const currentUserId = req.user?._id;
  if (!currentUserId) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Convert comma-separated string into an array
  const interestArray = interests.split(',').map(interest => interest.trim());

  // Fetch ALL users who have at least one matching interest, excluding the logged-in user
  // This is for Explore section - shows all users, not just accepted connections
  const users = await User.find({
    interests: { $in: interestArray },
    _id: { $ne: currentUserId }, // Exclude the logged-in user
  }).select('fullName profilePicture location interests');

  // If no users found
  if (!users.length) {
    return res.status(200).json({
      success: true,
      count: 0,
      companions: [],
      message: 'No companions found with these interests',
    });
  }

  // Return result
  res.status(200).json({
    success: true,
    count: users.length,
    companions: users,
  });
});

// --- Get User by ID ---
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid user ID');
  }

  const user = await User.findById(id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

export { getUsersByInterest, myCompanions, exploreCompanions, getUserById };

