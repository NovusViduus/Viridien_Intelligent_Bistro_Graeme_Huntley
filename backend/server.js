require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const menuRoutes = require("./routes/menu");
const chatRoutes = require("./routes/chat");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

/**
 * Health check endpoint returning server status and current timestamp.
 * @route GET /api/health
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/menu", menuRoutes);
app.use("/api/chat", chatRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🍽️  Intelligent Bistro API running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Menu:   http://localhost:${PORT}/api/menu`);
  console.log(`   Chat:   POST http://localhost:${PORT}/api/chat`);
});

module.exports = app;
