
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
export const pool = new Pool({
 connectionString: process.env.DATABASE_URL,
 ssl: {
        rejectUnauthorized: false
    }
});

// ==========================================
// 1. DATABASE INITIALIZATION
// ==========================================
export const initDb = async () => {
 try {
  // Table USERS
  await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                is_ginger BOOL DEFAULT TRUE,
                image_url TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            );
        `);

  // Table MESSAGES
  await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                username TEXT,
                user_image TEXT,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
 } catch (err) {
  console.error("❌ Erreur lors de l'initialisation de la base de données :", err);
 }
};

