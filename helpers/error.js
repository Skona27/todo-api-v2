// error handler function
function errorHandler(error, request, response, next) {
  // respond with error status code and send json msg
  return response.status(error.status || 500).json({
      error: {
          message: error.message || "Oops! Something went wrong."
      }
  })
}

module.exports = errorHandler;