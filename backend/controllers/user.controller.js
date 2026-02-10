const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert new user (handle both with and without name column)
    try {
      await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
        [name, email, hashedPassword]
      );
    } catch (err) {
      // If name column doesn't exist, insert without it
      if (err.code === '42703') {
        await pool.query(
          "INSERT INTO users (email, password) VALUES ($1, $2)",
          [email, hashedPassword]
        );
      } else {
        throw err;
      }
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // 1. Check if user exists
  const userResult = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (userResult.rows.length === 0) {
    return res.status(400).json({ message: "User not registered" });
  }

  const user = userResult.rows[0];

  // 2. Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  // 3. Generate token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login successful",
    token
  });
};

module.exports = { registerUser, loginUser };
