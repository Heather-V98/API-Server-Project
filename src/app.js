const express = require("express");
const authRoutes = require("./routes/auth.routes");
const cardRoutes = require("./routes/cards.routes");
const metaRoutes = require("./routes/meta.routes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

// Routes
app.use(authRoutes);
app.use(cardRoutes);
app.use(metaRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ errorMessage: "Route not found." });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
