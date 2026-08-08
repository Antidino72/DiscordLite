const db = require('./index');

// language=SQLite
module.exports = {
    findGoogleId: db.prepare('SELECT * FROM users WHERE google_id = ?'),

    insertUser: db.prepare('INSERT INTO users (username, google_id, image) VALUES (?, ?, ?)'),

    insertMessage: db.prepare('INSERT INTO messages (user_id, username, user_image, content) VALUES (?, ?, ?, ?)'),

    removeAllMessages: db.prepare('DELETE FROM messages'),

    getMessagesBeforeID: db.prepare('SELECT * FROM messages WHERE id < ? ORDER BY id DESC LIMIT ?'),

    getMessagesAfterID : db.prepare(`SELECT *
                                     FROM messages
                                     WHERE id > ?
                                     ORDER BY id
                                     LIMIT ?`),

    getMessages: db.prepare('SELECT * FROM messages ORDER BY id DESC LIMIT ?')

};