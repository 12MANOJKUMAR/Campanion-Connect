import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// This middleware protects routes.
// It checks for the JWT in the HttpOnly cookie.
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Read the JWT from the cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // 2. Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get the user from the DB and attach it to the request object
      // We exclude the password
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      // 4. Call the next middleware
      next();
    } catch (error) {
      console.error(error);
      res.status(401); // Unauthorized
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { protect };
