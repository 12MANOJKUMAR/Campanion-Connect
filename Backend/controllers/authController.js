import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { generateToken, setCookie } from '../utils/generateToken.js';
import { protect } from '../middleware/authMiddleware.js';

// --- Register User ---
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, interests, profilePicture } = req.body;

  // 1. Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400); // Bad Request
    throw new Error('User already exists');
  }

  const defaultProfileImage = `https://ui-avatars.com/api/?name=${fullName}&background=random&size=256`;

  // 2. Create new user
  const user = await User.create({
    fullName,
    email,
    password, // Password will be hashed by the 'pre-save' middleware
    interests,
    profilePicture : profilePicture || defaultProfileImage,
  });

  // 3. If user created, log them in and send back data with token
  if (user) {
    const token = generateToken(user);
    setCookie(res, token); // Optional cookie; primary auth via Bearer token

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        interests: user.interests,
        profilePicture: user.profilePicture,
        location: user.location,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// --- Login User ---
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user by email
  const user = await User.findOne({ email });

  // 2. Check if user exists AND password matches
  if (user && (await user.matchPassword(password))) {
    // 3. Generate JWT token
    const token = generateToken(user);
    setCookie(res, token); // Optional cookie; primary auth via Bearer token

    // 4. Send user data back with success format
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        interests: user.interests || [],
        profilePicture: user.profilePicture || '',
        location: user.location || '',
      },
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password');
  }
});

// --- Logout User ---
const logoutUser = asyncHandler(async (req, res) => {
  // Clear the cookie by setting it to an empty value and
  // setting its expiration date to a time in the past.
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ 
    success: true,
    message: 'User logged out successfully' 
  });
});

// --- Get Current Authenticated User ---
const getMe = asyncHandler(async (req, res) => {
  // `protect` middleware attaches `req.user`
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.status(200).json({
    success: true,
    user: {
      _id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      interests: req.user.interests || [],
      profilePicture: req.user.profilePicture || '',
      location: req.user.location || '',
    },
  });
});

export { registerUser, loginUser, logoutUser, getMe };
