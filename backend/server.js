const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");

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

const userRoutes = require("./routes/user.routes");
app.use("/api/user", userRoutes);

app.get("/api/user/profile", (req, res) => {
  res.json({ message: "Profile route working" });
});
