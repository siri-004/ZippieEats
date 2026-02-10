const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/user", require("./routes/user.routes"));

// test route
app.get("/", (req, res) => {
  res.send("ZippieEats backend running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
