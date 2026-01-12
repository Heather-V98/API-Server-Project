function errorHandler(err, req, res, next) {
    const status = err.status || 500;
  
    if (status === 401) {
      return res.status(401).json({ errorMessage: err.message || "Unauthorized." });
    }
  
    if (status >= 400 && status < 500) {
      return res.status(status).json({ errorMessage: err.message || "Bad request." });
    }
  
    // default server error
    console.error(err);
    return res.status(500).json({ errorMessage: err.message || "Server error." });
  }
  
  module.exports = { errorHandler };
  