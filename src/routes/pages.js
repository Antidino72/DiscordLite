const route = require("express").Router();
const requireAuth = require('../middlewares/auth').requireAuth;
const join = require("node:path").join;

route.get('/', requireAuth, (req, res) => {
    res.sendFile(join(__dirname, '../../public', 'chat.html'));
});

// Public Route: Login page (No requireAuth here!)
route.get('/login', (req, res) => {
    // If already logged in, redirect straight to chat
    if (req.session && req.session.user) {
        return res.redirect('/');
    }
    res.sendFile(join(__dirname, '../../public', 'login.html'));
});

module.exports = route;