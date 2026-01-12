const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      const err = new Error("Missing or malformed Authorization header. Use: Bearer <token>.");
      err.status = 401;
      throw err;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      const err = new Error("JWT secret is not configured on the server.");
      err.status = 500;
      throw err;
    }

    const payload = jwt.verify(token, secret);
    req.user = payload;
    return next();
  } catch (e) {
    const err = new Error("Invalid or expired token.");
    err.status = 401;
    return next(err);
  }
}

module.exports = { requireAuth };
