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
                public_id UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
                id SERIAL PRIMARY KEY,
                username TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                is_ginger BOOL NOT NULL DEFAULT TRUE,
                image_url TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL
            );
        `);
        // Table MESSAGES
        await pool.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(public_id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMPTZ NULL,
                updated_at TIMESTAMPTZ NULL
            );
        `);
    }
    catch (err) {
        console.error("Erreur lors de l'initialisation de la base de données :", err);
    }
};
//# sourceMappingURL=index.js.map