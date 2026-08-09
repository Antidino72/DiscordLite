import { socket, state } from './state.js';
import { userLogo, usernameDisplay, usernameDisplayBurger } from './dom.js';

export function emitSocketLogin() {
    const token = localStorage.getItem('token');


    socket.on('connect', () => {

        if (token) {
            socket.emit('login', { token });
        }
    });


    if (socket.connected && token) {
        socket.emit('login', { token });
    }
}

export async function loadUserProfile() {
    try {
        const response = await fetch('/api/me');

        if (!response.ok) {
            window.location.href = '/login';
            return;
        }

        const data = await response.json();
        state.currentUser = data.user;

        if (userLogo) {
            userLogo.src = state.currentUser.image
                || 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg';
        }
        if (usernameDisplay) usernameDisplay.textContent = state.currentUser.username;
        if (usernameDisplayBurger) usernameDisplayBurger.textContent = state.currentUser.username;
    } catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
    }
}
