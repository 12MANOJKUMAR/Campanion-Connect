import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// --- Get All Interests ---
// Returns all predefined interest categories
const getAllInterests = async (req, res) => {
  try {
    // Predefined list of interests
    const allInterests = [
      'Teaching',
      'Singing',
      'Traveling',
      'Reading',
      'Gaming',
      'Cooking',
      'Sports',
      'Technology',
      'Art',
      'Music',
      'Fitness',
      'Photography',
      'Dancing',
      'Writing',
      'Hiking'
    ];

    res.status(200).json({
      success: true,
      data: allInterests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch interests'
    });
  }
};

// --- Get User Interests ---
// Returns interests of a specific user
const getUserInterests = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('interests');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      data: user.interests || []
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || 'Failed to fetch user interests');
  }
});

export { getAllInterests, getUserInterests };

