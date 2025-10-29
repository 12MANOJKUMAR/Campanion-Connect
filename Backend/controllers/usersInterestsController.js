import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// --- Get Users by Interest ---
// Returns all users who have the specified interest
const getUsersByInterest = asyncHandler(async (req, res) => {
  try {
    const { interestName } = req.params;

    if (!interestName) {
      res.status(400);
      throw new Error('Interest name is required');
    }

    // Find all users with this interest in their interests array
    const users = await User.find({
      interests: { $in: [interestName] }
    }).select('fullName email location profilePicture interests bio').limit(50);

    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || 'Failed to fetch users by interest');
  }
});

const myCompanions =async (req, res) => {
  try {
    const { interests } = req.query;

    // Validate query
    if (!interests) {
      res.status(400);
      throw new Error('Interests query parameter is required');
    }

    // Convert comma-separated string into an array
    const interestArray = interests.split(',').map(interest => interest.trim());

    // Fetch users who have at least one matching interest
    const users = await User.find({
      interests: { $in: interestArray },
    }).select('fullName profilePicture location');

    // If no users found
    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: 'No companions found with these interests',
      });
    }

    // Return result
    res.status(200).json({
      success: true,
      count: users.length,
      companions: users,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch companions',
    });
  }
};

export { getUsersByInterest, myCompanions };

