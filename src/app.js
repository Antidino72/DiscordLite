const express = require("express");
const session = require("express-session");
const {join} = require("node:path");
const app = express();
require('dotenv').config();


const http = require('http').createServer(app);
const io = require('socket.io')(http);
require('./sockets/chat')(io)

app.use(express.json());

// Set security headers for Google OAuth popups
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});

// Configure Express Session (MUST be before routes)
app.use(session({
    secret : process.env.SECRET_SESSION, // Replace with a secure secret key
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // Session valid for 1 hour
}));

// Serve static assets (CSS, client JS, images)
app.use(express.static(join(__dirname, '../public')));
module.exports={
    app : app,
    io : io,
    http : http
}
//===================================
//          Route
//===================================
app.use('/',require('./routes/pages'));
app.use('/api',require('./routes/auth'));
app.use('/api',require('./routes/messages'));