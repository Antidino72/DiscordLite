const pool = require('./index'); // Assure-toi que index.js exporte une instance de Pool (ex: const { Pool } = require('pg'))

module.exports = {
    // 🔍 Trouver un utilisateur par son Google ID
    findGoogleId: async (googleId) => {
        const query = 'SELECT * FROM users WHERE google_id = $1';
        const res = await pool.query(query, [googleId]);
        return res.rows[0]; // Renvoie le premier utilisateur trouvé (ou undefined)
    },

    // 👤 Insérer un nouvel utilisateur
    insertUser: async (username, googleId, image) => {
        const query = 'INSERT INTO users (username, google_id, image) VALUES ($1, $2, $3) RETURNING *';
        const res = await pool.query(query, [username, googleId, image]);
        return res.rows[0];
    },

    // 💬 Insérer un nouveau message
    insertMessage: async (userId, username, userImage, content) => {
        const query = 'INSERT INTO messages (user_id, username, user_image, content) VALUES ($1, $2, $3, $4) RETURNING *';
        const res = await pool.query(query, [userId, username, userImage, content]);
        return res.rows[0];
    },

    // 🗑️ Supprimer tous les messages
    removeAllMessages: async () => {
        const query = 'DELETE FROM messages';
        return await pool.query(query);
    },

    // ⬅️ Obtenir les messages avant un ID spécifique (historique/scroll haut)
    getMessagesBeforeID: async (id, limit) => {
        const query = 'SELECT * FROM messages WHERE id < $1 ORDER BY id  LIMIT $2';
        const res = await pool.query(query, [id, limit]);
        return res.rows;
    },

    // ➡️ Obtenir les messages après un ID spécifique
    getMessagesAfterID: async (id, limit) => {
        const query = 'SELECT * FROM messages WHERE id > $1 ORDER BY id ASC LIMIT $2';
        const res = await pool.query(query, [id, limit]);
        return res.rows;
    },

    // 📜 Obtenir les derniers messages
    getMessages: async (limit) => {
        const query = 'SELECT * FROM messages ORDER BY id LIMIT $1';
        const res = await pool.query(query, [limit]);
        return res.rows;
    }
};