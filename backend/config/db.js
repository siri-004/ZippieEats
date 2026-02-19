// Load environment variables
require("dotenv").config();

const { Pool } = require("pg");

// PostgreSQL connection (Supabase compatible)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test connection
pool.connect()
  .then(() => {
    console.log("Connected to PostgreSQL database ✅");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL:", err);
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
};
