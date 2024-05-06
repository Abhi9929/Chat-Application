import { ApiError } from '../utils/ApiError.js';

const errorhandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors, 
      // stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  } else {
    // Handle unknown errors (e.g., logging, sending generic error messages)
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
  next();
};

const notFound = (req, res, next) => {
  const error = new ApiError(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export { errorhandler, notFound };
