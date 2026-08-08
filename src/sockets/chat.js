// src/sockets/chat.js
module.exports = (io) => {
    io.on('connection', (socket) => {

        socket.on('login', (json) => {
            console.log('Socket user logged in:', json);
        });

        socket.on('typing', (json) => {
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
};