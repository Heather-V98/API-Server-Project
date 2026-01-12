const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const { readJson } = require("../utils/fileStore");

const router = express.Router();
const USERS_PATH = path.join(__dirname, "..", "..", "data", "users.json");

router.post("/getToken", async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      const err = new Error("username and password are required.");
      err.status = 400;
      throw err;
    }

    const users = await readJson(USERS_PATH);
    const match = users.find((u) => u.username === username && u.password === password);

    if (!match) {
      const err = new Error("Invalid credentials.");
      err.status = 401;
      throw err;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      const err = new Error("JWT secret is not configured on the server.");
      err.status = 500;
      throw err;
    }

    const token = jwt.sign(
      { username: match.username, role: match.role || "player" },
      secret,
      { expiresIn: "2h" }
    );

    return res.json({
      successMessage: "Authentication successful.",
      token
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
