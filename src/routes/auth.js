// API Endpoint: Google Login Handler


const queries = require('../db/queries');
const {OAuth2Client} = require("google-auth-library");
const route = require("express").Router();
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(CLIENT_ID);
route.post('/login', async (req, res) => {
    const {google_id, username, image} = req.body;

    if (!google_id || !username || !image) {
        return res.status(400).json({error: 'Incomplete data provided'});
    }
    try {
        // Find existing user or register new one
        let user = await queries.findGoogleId(google_id);


        if (!user) {
            const result =await queries.insertUser(username, google_id, image);
            user = {
                id: result.lastInsertRowid,
                username: username,
                image: image,
                google_id: google_id
            };
        }
        // Save user info in session
        req.session.user = {
            id: user.id,
            username: user.username,
            image: user.image
        };

        res.json({
            success: true,
            user: user
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

route.get('/me', (req, res) => {
    if (req.session && req.session.user) {
        res.json({
            logged: true,
            user: req.session.user
        });
    } else {
        res.status(401).json({ logged: false, error: 'Non connecté' });
    }
});
route.post('/google-login', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token manquant' });
    }

    try {
        // 1. Vérification du token Google
        const ticket = await client.verifyIdToken({ idToken: token, audience: CLIENT_ID });
        const payload = ticket.getPayload();

        // 2. Recherche de l'utilisateur dans PostgreSQL
        const dbUser = await queries.findGoogleId(payload.sub);

        // 3. Vérification que l'utilisateur existe bien en BDD
        if (!dbUser) {
            console.error("⚠️ Tentative de connexion mais utilisateur non existant en BDD");
            return res.status(401).json({ error: 'Utilisateur non inscrit' });
        }

        // 4. Stockage des informations BDD + Google dans la SESSION
        req.session.user = {
            user_id: dbUser.id,                  // 👈 L'ID entier de PostgreSQL (ex: 12)
            google_id: payload.sub,              // L'ID Google string (sub)
            email: dbUser.email || payload.email,
            username: dbUser.username || payload.name,
            image: dbUser.picture || payload.picture
        };

        return res.json({ success: true, redirect: '/chat' });

    } catch (err) {
        console.error("Erreur d'authentification Google :", err.message);
        return res.status(401).json({ error: 'Token invalide' });
    }
});
module.exports = route;