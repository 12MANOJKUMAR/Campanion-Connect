import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  // Create the JWT
  const token = jwt.sign(
    { userId }, // Payload
    process.env.JWT_SECRET, // Secret
    { expiresIn: '30d' } // Expiration
  );

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
