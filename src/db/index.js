const { Pool } = require("pg");

const pool = new Pool({
 connectionString: process.env.DATABASE_URL,
 ssl: { rejectUnauthorized: false },
});

// ==========================================
// 1. DATABASE INITIALIZATION
// ==========================================
const initDb = async () => {
 try {
  // Table USERS
  await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT NOT NULL,
                google_id TEXT NOT NULL UNIQUE,
                image TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

  console.log("✅ Tables PostgreSQL initialisées avec succès !");
 } catch (err) {
  console.error("❌ Erreur lors de l'initialisation de la base de données :", err);
 }
};

// Exécuter l'initialisation au démarrage
initDb();

module.exports = pool;