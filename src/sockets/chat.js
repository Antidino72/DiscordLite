// src/sockets/chat.js
const queries = require("../db/queries");

module.exports = (io) => {

    io.on('connection', async (socket) => {

        // 1. Récupérer l'utilisateur stocké dans la session Express (au moment du handshake)
        const session = socket.request?.session;
        const user = session?.user;

        // 2. Si pas de session valide, on refuse la connexion socket
        if (!user) {
            console.warn("⚠️ Connexion Socket refusée : Aucune session Express valide.");
            socket.emit('unauthorized', {message: "Non authentifié"});
            return socket.disconnect(true);
        }

        socket.user = user;
        await queries.updateUserStatus(socket.user.id, "online");
        socket.broadcast.emit('user_connected', {
            user: socket.user,
            message: `${socket.user.username} a rejoint le chat.`
        });
        // ==========================================
        //         ÉVÉNEMENTS DE CHAT (Au même niveau)
        // ==========================================

        // Réception et sauvegarde d'un message
        socket.on('message_input', async (json) => {
            if (!socket.user) {
                console.error("Message refusé : utilisateur non identifié.");
                return;
            }

            const messageText = json.message;
            if (!messageText || !messageText.trim()) return;

            try {
                // Insertion dans la base de données
                await queries.insertMessage(
                    socket.user.user_id,
                    socket.user.username,
                    socket.user.image || socket.user.picture,
                    messageText
                );

                // Construction de l'objet à diffuser
                const fullMessage = {
                    user_id: socket.user.user_id,
                    username: socket.user.username,
                    user_image: socket.user.image || socket.user.picture,
                    message: messageText,
                    created_at: new Date().toISOString()
                };

                // Diffusion à TOUS les clients
                io.emit("message_received", fullMessage);

            } catch (error) {
                console.error("Erreur lors de l'enregistrement du message :", error);
            }
        });

        // Indicateur de frappe
        socket.on('typing', () => {
            socket.broadcast.emit('typing', {
                username: socket.user.username,
                socket_id: socket.id
            });
        });

        // Déconnexion
        socket.on('disconnect', async (reason) => {
            if (socket.user) {
                io.emit('user_left', {
                    user: socket.user,
                    message: `${socket.user.username} a quitté le chat.`
                });
                await queries.updateUserStatus(socket.user.id, "offline");
            } else {
                console.warn(`❌ Socket non identifiée déconnectée (${socket.id}) : ${reason}`);
            }
        });

    });

};