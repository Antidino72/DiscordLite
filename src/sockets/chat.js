// src/sockets/chat.js

const queries = require("../db/queries");
module.exports = (io) => {

    io.on('connection', (socket) => {

        socket.on('login', (userData) => {
            if (userData && userData.username) {

                socket.user = userData;
                console.log(`✅ Utilisateur identifié : ${socket.user.username} (Socket: ${socket.id})`);


                socket.broadcast.emit('user_connected', {
                    user: socket.user,
                    message: `${socket.user.username} a rejoint le chat.`
                });
            } else {
                console.log(`⚠️ Événement login reçu mais données invalides :`, userData);
            }
        });
        socket.on('disconnect', (reason) => {
            if (socket.user) {
                console.log(`❌ ${socket.user.username} s'est déconnecté (${reason})`);

                io.emit('user_left', {
                    user: socket.user,
                    message: `${socket.user.username} a quitté le chat.`
                });
            } else {
                console.log(`❌ Un utilisateur non identifié s'est déconnecté (${socket.id})`);
            }
        });

        socket.on('typing', (json) => {
            socket.broadcast.emit('typing', {
                username: json.username,
                socket_id: socket.id
            });
        });
        socket.on('message_input', (json) => {
            // 1. Sécurité : Vérifier que la socket est bien identifiée
            if (!socket.user) {
                console.error("⚠️ Message refusé : utilisateur non identifié sur la socket.");
                return;
            }

            const messageText = json.message;

            // 2. Insérer dans SQLite (avec l'ID utilisateur BDD, son pseudo, son image et le texte)
            queries.insertMessage.run(
                socket.user.user_id,
                socket.user.username,
                socket.user.image,
                messageText
            );

            // 3. Construire l'objet complet à diffuser en temps réel
            const fullMessage = {
                user_id: socket.user.user_id,        // ID réel en BDD
                username: socket.user.username, // Pseudo Google
                user_image: socket.user.image,  // Photo Google
                message: messageText,
                created_at: new Date().toISOString()
            };
            // 4. Envoyer le message complet à TOUS les clients connectés
            io.emit("message_received", fullMessage);
        });

    });

}