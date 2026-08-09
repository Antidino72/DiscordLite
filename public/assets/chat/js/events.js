import { socket, state } from './state.js';
import {getSettings, updateSettings} from "./settings/settings.js";
import { sendButton, messageInput, infoBox ,notification_settings} from './dom.js';


export function initSendEvent() {
    sendButton.addEventListener('click', (e) => {
        e.preventDefault();
        const text = messageInput.value.trim();

        if (text !== '' && state.currentUser) {
            socket.emit('message_input', {
                username: state.currentUser.username,
                message: text
            });

            messageInput.value = '';
            clearTimeout(state.typingTimeout);
            infoBox.textContent = '';
        }
    });
}

export function initTypingEvent() {
    messageInput.addEventListener('input', () => {
        if (state.currentUser) {
            socket.emit('typing', {
                username: state.currentUser.username,
                socket_id: socket.id
            });
        }
    });
}

export function initLogoutEvent() {
    document.querySelector('.btn-logout').addEventListener('click', async () => {
        await fetch('/api/logout', { method: 'POST' });
        localStorage.removeItem('token');
        sessionStorage.clear();
        window.location.href = '/login.html';
    });
}
