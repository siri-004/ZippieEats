const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// ======================
// Middlewares
// ======================
app.use(cors());
app.use(express.json());

// ======================
// API Routes
// ======================
app.use("/api/user", require("./routes/user.routes"));

// ======================
// Serve Static Frontend
// ======================
// Make sure this comes AFTER API routes
app.use(express.static(path.join(__dirname, "frontend")));

// SPA fallback: for any route not handled by API, send index.html
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
