const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

async function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }

    if (req.body?.token){
        const idToken = req.body.token || req.headers.authorization?.split(' ')[1];
        if (idToken) {
            try {
                // Vérification du token auprès de Google
                const ticket = await client.verifyIdToken({
                    idToken: idToken,
                    audience: CLIENT_ID, // S'assure que le token a été généré pour TON application
                });

                // Extraire les informations de l'utilisateur retournées par Google
                const payload = ticket.getPayload();

                const user = {
                    id: payload['sub'],         // Identifiant unique Google
                    email: payload['email'],    // Adresse e-mail
                    name: payload['name'],      // Nom complet
                    picture: payload['picture'] // Photo de profil
                };

                // On attache l'utilisateur à la requête
                req.user = user;

                // Optionnel : enregistrer la session
                if (req.session) {
                    req.session.user = user;
                }

                return next();
            } catch (error) {
                console.error("Token Google invalide :", error.message);
                return res.status(401).redirect("/login");
            }
        }
    }

    // 3. Aucun moyen d'authentification valide trouvé
    res.redirect("/login");
}

module.exports = {
    requireAuth: requireAuth,
};