// Load environment variables
require("dotenv").config();

// PostgreSQL via pg
const { Pool } = require("pg");

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test connection
pool.connect()
  .then(() => {
    console.log("Connected to PostgreSQL database ✅");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL:", err);
  });

module.exports = { query: (text, params) => pool.query(text, params) };
