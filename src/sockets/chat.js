// src/sockets/chat.js
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'TON_CLIENT_ID_GOOGLE.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
const queries = require("../db/queries");
module.exports = (io) => {

    io.on('connection', (socket) => {

        socket.on('login', async (data) => {
            // 1. On vérifie si un token a bien été envoyé dans l'objet (ex: { token: '...' })
            const token = data?.token || data;

            if (!token || typeof token !== 'string') {
                console.warn(`⚠️ Événement login reçu sans token valide :`, data);
                return;
            }

            try {
                // 2. Vérification du token Google auprès de Google
                const ticket = await client.verifyIdToken({
                    idToken: token,
                    audience: CLIENT_ID,
                });

                const payload = ticket.getPayload();

// 1. On récupère l'utilisateur complet depuis la BDD grâce à payload.sub (son ID Google)
                const dbUser = await queries.findGoogleId(payload.sub);

// 2. On vérifie s'il N'EXISTE PAS en BDD (note le !)
                if (!dbUser) {
                    console.warn("⚠️ Événement login reçu mais utilisateur non existant en BDD");
                    return socket.emit('login_error', { message: "Utilisateur non inscrit." });
                }

// 3. On stocke l'ID de la BDD et les infos récupérées
                socket.user = {
                    user_id: dbUser.id,         // ID interne PostgreSQL (ex: 1, 2, 3...)
                    google_id: payload.sub,     // ID Google
                    username: dbUser.username || payload.name, // Pseudo BDD (ou Google en secours)
                    email: dbUser.email || payload.email,
                    picture: dbUser.picture || payload.picture
                };

                // 4. Notification aux autres utilisateurs
                socket.broadcast.emit('user_connected', {
                    user: socket.user,
                    message: `${socket.user.username} a rejoint le chat.`
                });

            } catch (error) {
                // Le token est expiré, falsifié ou invalide
                console.warn(`⚠️ Événement login reçu mais token Google invalide :`, error.message);
            }
        });
        socket.on('disconnect', (reason) => {
            if (socket.user) {
                io.emit('user_left', {
                    user: socket.user,
                    message: `${socket.user.username} a quitté le chat.`
                });
            } else {
                console.warn(`❌ Un utilisateur non identifié s'est déconnecté (${socket})`);
            }
        });

        socket.on('typing', (json) => {
            socket.broadcast.emit('typing', {
                username: json.username,
                socket_id: socket.id
            });
        });
        socket.on('message_input', async (json) => {
            // 1. Sécurité : Vérifier que la socket est bien identifiée
            if (!socket.user) {
                console.error("⚠️ Message refusé : utilisateur non identifié sur la socket.");
                return;
            }

            const messageText = json.message;

            // 2. Insérer dans SQLite (avec l'ID utilisateur BDD, son pseudo, son image et le texte)
            await queries.insertMessage(
                socket.user.user_id,
                socket.user.username,
                socket.user.picture,
                messageText
            );

            // 3. Construire l'objet complet à diffuser en temps réel
            const fullMessage = {
                user_id: socket.user.user_id,        // ID réel en BDD
                username: socket.user.username, // Pseudo Google
                user_image: socket.user.picture,  // Photo Google
                message: messageText,
                created_at: new Date().toISOString()
            };
            // 4. Envoyer le message complet à TOUS les clients connectés
            io.emit("message_received", fullMessage);
        });

    });

}