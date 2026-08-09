import { messagebox } from './dom.js';

export function showLoader() {
    if (document.getElementById('chat-loader')) return;

    const loaderDiv = document.createElement('div');
    loaderDiv.id = 'chat-loader';
    loaderDiv.className = 'chat-loader';
    loaderDiv.innerHTML = '<div class="spinner"></div>';

    messagebox.insertBefore(loaderDiv, messagebox.firstChild);
}

export function hideLoader() {
    document.getElementById('chat-loader')?.remove();
}
