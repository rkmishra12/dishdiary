import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), "backend/.env") });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false },
    });

    console.log("⚡ Connected to Aiven!");
    console.log("DB USER:", process.env.DB_USER);
  } catch (err) {
    console.error("❌ Error initializing DB:", err);
  }
}

initializeDatabase();
