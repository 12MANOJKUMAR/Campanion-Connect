import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Protect routes using standard Bearer token from Authorization header
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Prefer standard Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Fallback to cookie only if header is not provided (optional)
  if (!token && req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach full user (without password) based on decoded.userId
    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    // Also expose decoded payload if needed downstream
    req.tokenPayload = decoded;

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token invalid or expired');
  }
});

export { protect };
