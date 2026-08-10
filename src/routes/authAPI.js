const route = require("express").Router();
const queries = require('../db/queries');
const { OAuth2Client } = require("google-auth-library");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

// 1. Inscription / Connexion Classique ou Google directe
route.post('/login', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token manquant' });
    }

    let payload;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
    } catch (err) {
        return res.status(400).json({ error: "Token invalide ou expiré" });
    }

    try {
        let user = await queries.findGoogleId(payload.sub);

        if (!user) {
            // Création dans la BDD (payload.name et non payload.username)
            const result = await queries.insertUser(payload.name, payload.sub, payload.picture);

            user = {
                // Récupération sécurisée de l'id
                id: result?.lastInsertRowid || result?.rows?.[0]?.id || result?.id,
                username: payload.name, // 👈 CORRIGÉ : payload.name
                image: payload.picture,
                google_id: payload.sub,
            };
        }

        req.session.regenerate((err) => {
            if (err) {
                console.error('Failed to regenerate session:', err);
                return res.status(500).json({ error: 'Erreur interne du serveur' });
            }

            req.session.user = {
                user_id: user.id || user.user_id,
                username: user.username || payload.name,
                image: user.image || payload.picture,
                google_id: user.google_id || payload.sub
            };

            req.session.save((saveErr) => {
                if (saveErr) {
                    console.error('Failed to save session:', saveErr);
                    return res.status(500).json({ error: 'Erreur interne du serveur' });
                }

                return res.json({
                    success: true,
                    user: req.session.user,
                    redirect: '/chat'
                });
            });
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});
// 2. Vérification de la session courante
route.get('/me', (req, res) => {
    if (req.session && req.session.user) {
        return res.json({
            logged: true,
            user: req.session.user
        });
    }
    return res.status(401).json({ logged: false, error: 'Non connecté' });
});

// 3. Connexion automatique via Token Google
route.post('/google-login', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token manquant' });
    }

    try {
        const ticket = await client.verifyIdToken({ idToken: token, audience: CLIENT_ID });
        const payload = ticket.getPayload();

        const dbUser = await queries.findGoogleId(payload.sub);

        if (!dbUser) {
            console.error("⚠️ Tentative de connexion mais utilisateur non existant en BDD");
            return res.status(401).json({ error: 'Utilisateur non inscrit' });
        }

        req.session.regenerate((err) => {
            if (err) {
                console.error('Failed to regenerate session:', err);
                return res.status(500).json({ error: 'Erreur interne du serveur' });
            }

            req.session.user = {
                user_id: dbUser.id || dbUser.user_id,
                google_id: payload.sub,
                email: dbUser.email || payload.email,
                username: dbUser.username || payload.name,
                image: dbUser.picture || payload.picture
            };

            req.session.save((saveErr) => {
                if (saveErr) {
                    console.error('Failed to save session:', saveErr);
                    return res.status(500).json({ error: 'Erreur interne du serveur' });
                }

                return res.json({ success: true, redirect: '/chat' });
            });
        });

    } catch (err) {
        console.error("Erreur d'authentification Google :", err.message);
        return res.status(401).json({ error: 'Token invalide' });
    }
});

// 4. Déconnexion
route.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ error: 'Impossible de se déconnecter' });
            }
            res.clearCookie('connect.sid'); // Supprime le cookie de session Express
            return res.json({ success: true });
        });
    } else {
        return res.json({ success: true });
    }
});

module.exports = route;