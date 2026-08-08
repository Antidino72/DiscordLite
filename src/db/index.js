const Database = require("better-sqlite3");

const db = new Database("database.db");


// ==========================================
// 1. DATABASE INITIALIZATION
// ==========================================
// language=SQLite
db.exec(`
    CREATE TABLE IF NOT EXISTS users
    (
        id       INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        google_id TEXT NOT NULL UNIQUE,
        image TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL
    )
`);
db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        username TEXT,
        user_image TEXT,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
 `)
module.exports = db