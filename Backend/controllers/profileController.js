import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// --- Update User Profile ---
const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, location, interests, bio, occupation, profilePicture, socialLinks } = req.body;

    // Build update object with only provided fields
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (location !== undefined) updateData.location = location;
    if (interests !== undefined) updateData.interests = interests;
    if (bio !== undefined) updateData.bio = bio;
    if (occupation !== undefined) updateData.occupation = occupation;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
    if (socialLinks !== undefined) updateData.socialLinks = socialLinks;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || 'Failed to update profile');
  }
});

// --- Update Visibility Settings ---
const updateVisibility = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const visibilitySettings = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { visibility: visibilitySettings } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || 'Failed to update visibility settings');
  }
});

export { updateProfile, updateVisibility };

