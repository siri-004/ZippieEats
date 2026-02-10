const express = require("express");
const cors = require("cors");
const path = require("path"); // add this at the top
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
// This should come **after your API routes**
app.use(express.static(path.join(__dirname, "public"))); // public = folder with your index.html

// For any other routes (SPA fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ======================
// Test Route (Optional)
// ======================
// You can keep this for testing, but it may be replaced by the "*" route above
// app.get("/", (req, res) => {
//   res.send("ZippieEats backend running 🚀");
// });

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
