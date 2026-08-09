import { socket, state } from './state.js';
import { messagebox, infoBox } from './dom.js';
import { createMessageElement } from './messages.js';
import {showNotification } from './settings/notification.js';

export function initSocketListeners() {
    socket.on('unauthorized', () => {
        console.warn("Session expirée ou serveur redémarré. Redirection vers le login...");

        // On redirige proprement l'utilisateur vers la page de connexion
        window.location.href = '/login';
    });
    socket.on('user_connected', (data) => {
        messagebox.appendChild(createMessageElement(data.message, 'message_info'));
    });

    socket.on('user_left', (data) => {
        messagebox.appendChild(createMessageElement(data.message, 'message_info'));
    });

    socket.on('typing', (data) => {
        if (data.socket_id === socket.id) return;

        infoBox.textContent = `${data.username} est en train d'écrire...`;
        clearTimeout(state.typingTimeout);
        state.typingTimeout = setTimeout(() => {
            infoBox.textContent = '';
        }, 1000);
    });

    socket.on('message_received', (data) => {
        const messageText = `${data.username} : ${data.message}`;
        const isMyMessage = data.user_id === state.currentUser.user_id;
        const messageClass = isMyMessage ? 'message_send' : 'message_received';
        if (!isMyMessage){
            showNotification("New Message", messageText)
        }
        messagebox.appendChild(createMessageElement(messageText, messageClass));
        messagebox.scrollTop = messagebox.scrollHeight;
    });
}
