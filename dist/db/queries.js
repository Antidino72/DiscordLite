import { pool } from "./index.js";
export class Queries {
    async insertUser(username, password, image) {
        if (!image) {
            image = process.env.DEFAULT_USER_IMAGE
                || "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg";
        }
        const final_image = image;
        const query = 'INSERT INTO users (username, password_hash, image_url) VALUES ($1, $2, $3) RETURNING *';
        const res = await pool.query(query, [username, password, final_image]);
        return res.rows[0];
    }
    async getUserByUsername(username) {
        const query = 'SELECT id , public_id, username, password_hash FROM users WHERE username = $1 LIMIT 1';
        const res = await pool.query(query, [username]);
        return res.rows[0];
    }
    async insertMessage(userId, username, userImage, content) {
        const query = 'INSERT INTO messages (user_id, username, user_image, content) VALUES ($1, $2, $3, $4) RETURNING *';
        const res = await pool.query(query, [userId, username, userImage, content]);
        return res.rows[0];
    }
    async getUserByPublicId(publicId) {
        const query = 'SELECT id, public_id, username, image_url FROM users WHERE public_id = $1 LIMIT 1';
        const res = await pool.query(query, [publicId]);
        return res.rows[0];
    }
    async getMessagesBeforeID(id, limit) {
        const query = 'SELECT * FROM messages WHERE id < $1 ORDER BY id  LIMIT $2';
        const res = await pool.query(query, [id, limit]);
        return res.rows;
    }
    async getMessagesAfterID(id, limit) {
        const query = 'SELECT * FROM messages WHERE id > $1 ORDER BY id  LIMIT $2';
        const res = await pool.query(query, [id, limit]);
        return res.rows;
    }
    async getMessages(limit) {
        const query = 'SELECT * FROM messages ORDER BY id LIMIT $1';
        const res = await pool.query(query, [limit]);
        return res.rows;
    }
    async updateUserStatus(state) {
        const query = 'UPDATE users SET status = $2 WHERE id = $1';
        const res = await pool.query(query, state);
        return res.rows[0];
    }
    async getUserList() {
        const query = 'SELECT username,status FROM users';
        const res = await pool.query(query);
        return res.rows;
    }
}
//# sourceMappingURL=queries.js.map