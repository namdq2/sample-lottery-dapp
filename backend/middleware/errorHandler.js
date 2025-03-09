// General error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Default error status and message
  const status = err.statusCode || 500;
  const message = err.message || 'Server Error';
  
  res.status(status).json({
    success: false,
    error: message
  });
};

module.exports = errorHandler;
