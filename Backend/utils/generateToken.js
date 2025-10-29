import jwt from 'jsonwebtoken';

// Generate JWT with standard user payload for stateless auth
const generateToken = (user) => {
  const payload = {
    userId: user._id?.toString ? user._id.toString() : user._id || user.userId,
    email: user.email,
    fullName: user.fullName,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
  return token;
};

// Helper function to set cookie
const setCookie = (res, token) => {
  res.cookie('jwt', token, {
    httpOnly: true, // Prevents client-side JS from reading the cookie
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production (HTTPS)
    sameSite: 'strict', // Prevents CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export { generateToken, setCookie };
export default generateToken;
