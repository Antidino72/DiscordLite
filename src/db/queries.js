const {pool}  = require('./index');
const {state} = require("pg/lib/native/query"); // Assure-toi que index.js exporte une instance de Pool (ex: const { Pool } = require('pg'))

module.exports = {
    // language=PostgreSQL
    findGoogleId: async (googleId) => {
        const query = 'SELECT * FROM users WHERE google_id = $1';
        const res = await pool.query(query, [googleId]);
        return res.rows[0]; // Renvoie le premier utilisateur trouvé (ou undefined)
    },
    insertUser: async (username, googleId, image) => {
        const query = 'INSERT INTO users (username, google_id, image) VALUES ($1, $2, $3) RETURNING *';
        const res = await pool.query(query, [username, googleId, image]);
        return res.rows[0];
    },
    insertMessage: async (userId, username, userImage, content) => {
        const query = 'INSERT INTO messages (user_id, username, user_image, content) VALUES ($1, $2, $3, $4) RETURNING *';
        const res = await pool.query(query, [userId, username, userImage, content]);
        return res.rows[0];
    },
    getMessagesBeforeID: async (id, limit) => {
        const query = 'SELECT * FROM messages WHERE id < $1 ORDER BY id  LIMIT $2';
        const res = await pool.query(query, [id, limit]);
        return res.rows;
    },

    getMessagesAfterID: async (id, limit) => {
        const query = 'SELECT * FROM messages WHERE id > $1 ORDER BY id  LIMIT $2';
        const res = await pool.query(query, [id, limit]);
        return res.rows;
    },
    getMessages: async (limit) => {
        const query = 'SELECT * FROM messages ORDER BY id LIMIT $1';
        const res = await pool.query(query, [limit]);
        return res.rows;
    },
    updateUserStatus: async (state)=>{
        // language=PostgreSQL
        const query = 'UPDATE users SET status = $2 WHERE id = $1';
        const res  = await pool.query(query,state)
        return res.rows[0];
    },
    getUserList: async ()=>{
        // language=PostgreSQL
        const query = 'SELECT username,status FROM users'
        const res = await pool.query(query)
        return res.rows;
    }
};