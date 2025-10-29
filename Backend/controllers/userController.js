import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// --- Get Current User ---
// Matches your `checkAuthStatus` thunk
const getMe = asyncHandler(async (req, res) => {
  // `req.user` is attached by the `protect` middleware
  // We select '-password' to exclude the hashed password from the response
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { getMe };
