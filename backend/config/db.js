import dotenv from "dotenv";
dotenv.config({ path: "backend/.env" });

import mysql from "mysql2";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: { rejectUnauthorized: false }, // This alone works for Aiven
});

export default pool.promise();
