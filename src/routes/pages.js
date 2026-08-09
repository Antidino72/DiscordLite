const route = require("express").Router();
const requireAuth = require('../middlewares/auth').requireAuth;
const join = require("node:path").join;

route.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../../public', 'home.html'));
});
route.get('/chat', (requireAuth), (req, res) => {
    res.sendFile(join(__dirname, '../../public', 'chat.html'));
})

// Public Route: Login page (No requireAuth here!)
route.get('/login', (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect('/chat');
    }
    res.sendFile(join(__dirname, '../../public', 'login.html'));
});

module.exports = route;