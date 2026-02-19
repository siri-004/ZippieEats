const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");

const app = express();

// ======================
// Middlewares
// ======================
app.use(cors());
app.use(express.json());

// ======================
// API Routes
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/user", require("./routes/user.routes"));

// ======================
// Serve Static Frontend
// ======================

// Serve entire frontend folder (NOT a single file)
app.use(express.static(path.join(__dirname, "../frontend")));

// Default route → show login page first
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
