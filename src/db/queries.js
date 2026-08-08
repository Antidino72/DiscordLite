const db =require('./index');
module.exports = {
    findGoogleId : db.prepare('SELECT * FROM users WHERE google_id = ?'),
    insertUser : db.prepare('INSERT INTO users (username,google_id,image) VALUES (?,?,?)',)
}