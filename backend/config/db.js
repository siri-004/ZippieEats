// db.js
const { Pool } = require("pg");
require("dotenv").config();

// Create a new Pool using your .env variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to Supabase:", err);
  } else {
    console.log("Connected to Supabase database ✅");
    release();
  }
});

module.exports = pool;
