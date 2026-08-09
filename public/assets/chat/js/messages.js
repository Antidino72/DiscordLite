import { state } from './state.js';
import { messagebox, message_scroll } from './dom.js';
import { showLoader, hideLoader } from './loader.js';

export function createMessageElement(content, className = '') {
    const li = document.createElement('li');
    li.textContent = content;
    if (className) li.className = className;
    return li;
}

export async function loadMessagesHistory() {
    if (state.isLoadingHistory || !state.hasMoreMessages) return;
    state.isLoadingHistory = true;

    const isPagination = state.oldestMessageId !== null;
    if (isPagination) showLoader();

    const url = isPagination
        ? `/api/messages?before=${state.oldestMessageId}`
        : '/api/messages';

    try {
        const response = await fetch(url);
        const data = await response.json();
        const messages = data.messages;

        if (messages.length < 30) {
            state.hasMoreMessages = false;
        }

        if (messages.length > 0) {
            state.oldestMessageId = messages[0].id;

            const previousScrollHeight = messagebox.scrollHeight;
            const fragment = document.createDocumentFragment();

            messages.forEach(msg => {
                 // 1. Récupération sécurisée de l'ID courant (supporte .user_id ou .id)
                const currentUserId = state.currentUser?.user_id ?? state.currentUser?.id;

                // 2. Conversion explicite en Number() pour éviter le piège String vs Number
                const isMyMessage = Number(msg.user_id) === Number(currentUserId);

                const messageText = `${msg.username} : ${msg.content || msg.message}`;
                const className = isMyMessage ? 'message_send' : 'message_received';

                fragment.appendChild(createMessageElement(messageText, className));
            });
            if (isPagination) {
                messagebox.insertBefore(fragment, messagebox.firstChild);
                messagebox.scrollTop = messagebox.scrollHeight - previousScrollHeight;
            } else {
                messagebox.appendChild(fragment);
                setTimeout(() => messagebox.scrollTop = messagebox.scrollHeight, 50);
            }
        }
    } catch (error) {
        console.error('Erreur chargement messages :', error);
    } finally {
        hideLoader();
        state.isLoadingHistory = false;
    }
}

export function initScrollListener() {
    message_scroll.addEventListener('scroll', async () => {
        if (message_scroll.scrollTop <= 10 && state.hasMoreMessages) {
            await loadMessagesHistory();
        }
    });
}
