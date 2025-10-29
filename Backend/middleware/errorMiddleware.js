// --- 404 Not Found Handler ---
// This catches any requests that don't match our routes
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass error to the general error handler
};


// --- General Error Handler ---
// This catches all errors thrown in our app
const errorHandler = (err, req, res, next) => {
  // Sometimes an error might come in with a 200 status code
  // If so, set it to 500 (Internal Server Error)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose-specific error handling (e.g., bad ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    message: message,
    // Only show the stack trace in development
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

export { notFound, errorHandler };
