import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, '../schema.sql');

async function initializeDatabase() {
    let connection;
    try {
        // Connect without database selected first to create it if needed
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true // Enable multiple queries
        });

        console.log('Connected to MySQL server.');

        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema.sql...');
        await connection.query(schema);

        console.log('Database and Tables initialized successfully!');

    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        if (connection) await connection.end();
    }
}

initializeDatabase();
