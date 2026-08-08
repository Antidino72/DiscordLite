const express = require('express');
require('dotenv').config();
const session = require('express-session');
const { join } = require('node:path');
const Database = require('better-sqlite3');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// ==========================================
// 1. DATABASE INITIALIZATION
// ==========================================
const db = new Database("database.db");

// language=SQLite
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        google_id TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL
    )
`);

// ==========================================
// 2. MIDDLEWARES CONFIGURATION
// ==========================================
// Parse JSON request bodies
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
app.use(express.static(join(__dirname, 'public')));

// Authentication guard middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
}

// ==========================================
// 3. HTTP ROUTES
// ==========================================

// Protected Route: Chat interface (Main Page)
app.get('/', requireAuth, (req, res) => {
    res.sendFile(join(__dirname, 'public', 'chat.html'));
});

// Public Route: Login page (No requireAuth here!)
app.get('/login', (req, res) => {
    // If already logged in, redirect straight to chat
    if (req.session && req.session.user) {
        return res.redirect('/');
    }
    res.sendFile(join(__dirname, 'public', 'login.html'));
});

// API Endpoint: Google Login Handler
app.post('/api/login', (req, res) => {
    const { google_id, username } = req.body;

    if (!google_id || !username ) {
        return res.status(400).json({ error: 'Incomplete data provided' });
    }
    try {
        // Find existing user or register new one
        const findUser = db.prepare('SELECT * FROM users WHERE google_id = ?');
        let user = findUser.get(google_id);

        if (!user) {
            const insertUser = db.prepare('INSERT INTO users (username, google_id) VALUES (?, ?)');
            const result = insertUser.run(username, google_id);

            user = {
                id: result.lastInsertRowid,
                username: username,
                google_id: google_id
            };
            console.log(`🆕 New user registered: ${username} (ID: ${user.id})`);
        } else {
            console.log(`👋 Returning user: ${user.username}`);
        }

        // Save user info in session
        req.session.user = {
            id: user.id,
            username: user.username
        };

        res.json({
            success: true,
            user: user
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/me', (req, res) => {
    if (req.session && req.session.user) {
        // On renvoie les infos stockées dans la session
        res.json({
            logged: true,
            user: req.session.user
        });
    } else {
        res.status(401).json({ logged: false, error: 'Non connecté' });
    }
});
// ==========================================
// 4. WEBSOCKET HANDLERS (Socket.io)
// ==========================================
io.on('connection', (socket) => {

    socket.on('login', (json) => {
        console.log('Socket user logged in:', json);
    });

    socket.on('typing', (json) => {
        // Use broadcast so the sender doesn't receive their own typing event
        socket.broadcast.emit('typing', {
            username: json.username,
            socket_id: socket.id
        });
    });

    socket.on('message_input', (json) => {
        json.user_id = socket.id;
        io.emit("message_received", json);
    });
});

// ==========================================
// 5. SERVER INITIALIZATION
// ==========================================
http.listen(process.env.PORT, () => {
    console.log('Server running on http://localhost:'+process.env.PORT);
});