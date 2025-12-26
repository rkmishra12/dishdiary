import path from "path";
import fs from "fs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load ENV from backend folder
dotenv.config({ path: path.join(process.cwd(), "backend/.env") });

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
      multipleStatements: true, // REQUIRED for schema.sql
    });

    const schema = fs.readFileSync(
      path.join(process.cwd(), "backend/schema.sql"),
      "utf8"
    );
    await connection.query(schema);

    console.log("🎉 Tables created successfully on Aiven!");
    await connection.end();
  } catch (err) {
    console.error("❌ Error initializing DB:", err);
  }
})();
