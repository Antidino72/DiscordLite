// ==========================================
// 1. INITIALISATION ET VARIABLES
// ==========================================
const socket = io();
let currentUser = null;
let typingTimeout = null;

const sendButton = document.getElementById('send');
const messagebox = document.getElementById('messagebox');
const message_scroll = document.getElementById('messages');
const messageInput = document.getElementById('message_input');
const infoBox = document.getElementById('infobox');
const userLogo = document.querySelector('.user_picture > img');
const usernameDisplay = document.getElementById('user-display');

// ==========================================
// 2. FONCTION POUR ENVOYER LE LOGIN AU SERVEUR
// ==========================================
function emitSocketLogin() {
    // ⚠️ On n'envoie 'login' QUE si l'utilisateur est bien chargé ET la socket connectée
    if (currentUser && socket.connected) {
        socket.emit('login', {
            username: currentUser.username,
            socket_id: socket.id,
            image: currentUser.image,
            user_id: currentUser.id
        });
    }
}

// ==========================================
// 3. RECUPERATION DU PROFIL ET DEMARRAGE
// ==========================================
function showLoader() {
    // Vérifier s'il n'existe pas déjà
    if (document.getElementById('chat-loader')) return;

    const loaderDiv = document.createElement('div');
    loaderDiv.id = 'chat-loader';
    loaderDiv.className = 'chat-loader';
    loaderDiv.innerHTML = '<div class="spinner"></div>';

    // L'insérer tout en haut du messagebox
    messagebox.insertBefore(loaderDiv, messagebox.firstChild);
}

// 2. Retirer l'indicateur de chargement
function hideLoader() {
    const loader = document.getElementById('chat-loader');
    if (loader) {
        loader.remove();
    }
}
async function loadUserProfile() {
    try {
        const response = await fetch('/api/me');

        if (!response.ok) {
            window.location.href = '/login';
            return;
        }

        const data = await response.json();
        currentUser = data.user;

        // Mettre à jour l'interface
        if (userLogo) userLogo.src = currentUser.image || '/assets/default-avatar.png';
        if (usernameDisplay) usernameDisplay.textContent = currentUser.username;
        // 🚀 Une fois le profil chargé, on s'identifie immédiatement auprès de la socket !
        emitSocketLogin();

    } catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
    }
}

let oldestMessageId = null;
let hasMoreMessages = true;
let isLoadingHistory = false;

async function loadMessagesHistory() {
    if (isLoadingHistory || !hasMoreMessages) return;
    isLoadingHistory = true;

    const isPagination = oldestMessageId !== null;

    // Afficher le loader seulement si on remonte dans l'historique (pagination)
    if (isPagination) {
        showLoader();
    }

    const url = isPagination
        ? `/api/messages?before=${oldestMessageId}`
        : '/api/messages';

    try {
        const response = await fetch(url);
        const data = await response.json();
        const messages = data.messages;

        if (messages.length < 30) {
            hasMoreMessages = false;
        }

        if (messages.length > 0) {
            oldestMessageId = messages[0].id;

            const previousScrollHeight = messagebox.scrollHeight;
            const fragment = document.createDocumentFragment();

            messages.forEach(msg => {
                const isMyMessage = currentUser && (String(msg.user_id) === String(currentUser.id));
                const messageText = `${msg.username} : ${msg.content || msg.message}`;
                const className = isMyMessage ? 'message_send' : 'message_received';

                const li = createMessageElement(messageText, className);
                fragment.appendChild(li);
            });

            if (isPagination) {
                // Insérer les nouveaux messages juste après/à la place du loader
                messagebox.insertBefore(fragment, messagebox.firstChild);

                // Maintien du scroll fluide
                messagebox.scrollTop = messagebox.scrollHeight - previousScrollHeight;
            } else {
                // Premier chargement
                messagebox.appendChild(fragment);
                setTimeout(() => messagebox.scrollTop = messagebox.scrollHeight, 50);
            }
        }
    } catch (error) {
        console.error("Erreur chargement messages :", error);
    } finally {
        // Toujours retirer le loader à la fin de la requête
        hideLoader();
        isLoadingHistory = false;
    }
}

// Écouteur de scroll bidirectionnel
message_scroll.addEventListener('scroll', async () => {

    if (message_scroll.scrollTop <= 10 && hasMoreMessages) {
        loadMessagesHistory();
    }
});
loadUserProfile();
// Lancement au démarrage
loadMessagesHistory()


// Ré-émettre le 'login' si la socket se déco/reco automatiquement
socket.on('connect', () => {
    emitSocketLogin();
});

// Lancer le chargement du profil


// ==========================================
// 4. ÉVÉNEMENTS DU DOM (ENVOI ET TYPING)
// ==========================================
sendButton.addEventListener('click', (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();

    if (text !== '' && currentUser) {
        socket.emit('message_input', {
            username: currentUser.username,
            message: text
        });

        messageInput.value = '';
        clearTimeout(typingTimeout);
        infoBox.textContent = '';
    }
});

messageInput.addEventListener('input', () => {
    if (currentUser) {
        socket.emit('typing', {
            username: currentUser.username,
            socket_id: socket.id
        });
    }
});

// ==========================================
// 5. RÉCEPTION DES MESSAGES SOCKET.IO
// ==========================================
function createMessageElement(content, className = '') {
    const li = document.createElement('li');
    li.textContent = content;
    if (className) li.className = className;
    return li;
}

socket.on('user_connected', (data) => {
    const li = createMessageElement(data.message, 'message_info');
    messagebox.appendChild(li);
});

socket.on('user_left', (data) => {
    const li = createMessageElement(data.message, 'message_info');
    messagebox.appendChild(li);
});

socket.on('typing', (data) => {
    if (data.socket_id === socket.id) return;

    infoBox.textContent = `${data.username} est en train d'écrire...`;
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        infoBox.textContent = '';
    }, 1000);
});

socket.on('message_received', (data) => {
    const messageText = `${data.username} : ${data.message}`;
    const isMyMessage = (data.user_id === currentUser.id);

    const messageClass = isMyMessage ? 'message_send' : 'message_received';

    const li = createMessageElement(messageText, messageClass);
    messagebox.appendChild(li);
    messagebox.scrollTop = messagebox.scrollHeight;
});