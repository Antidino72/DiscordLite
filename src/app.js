const express = require("express");
const session = require("express-session");
const {join} = require("node:path");
const { rateLimit } = require('express-rate-limit');
const {initDb} = require("./db/index");
const app = express();
require('dotenv').config();


const http = require('http').createServer(app);
const io = require('socket.io')(http);
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15
    message: "Trop de requêtes, Veuillez réessayer plus tard.",
    standardHeaders: true,
    legacyHeaders: false,
    limit: 100 // limite chaque IP à 100 requêtes par fenêtre
});
require('./sockets/chat')(io)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set security headers for Google OAuth popups
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Configure Express Session (MUST be before routes)
const session_middleware = session({
    name: 'connect.sid',
    secret: process.env.SESSION_SECRET, // 👈 Lu depuis le fichier .env
    resave: false,
    saveUninitialized: false,
    rolling: true,
    proxy: process.env.NODE_ENV === 'production',
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000
    }
});

app.use(session_middleware)
io.engine.use(session_middleware)

// Serve static assets (CSS, client JS, images)
app.use(express.static(join(__dirname, '../public')));

//==================================
//          Limiter
//===================================
app.use('/api/',limiter);

//===================================
//          Route
//===================================
app.use('/',require('./routes/pages'));
app.use('/api',require('./routes/auth'),);
app.use('/api',require('./routes/messages'));
initDb()
module.exports={
    app : app,
    io : io,
    http : http
}