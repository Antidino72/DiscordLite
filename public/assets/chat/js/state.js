export const socket = io();

const DEFAULT_SETTINGS = {
    theme: 'dark',           // 'dark' ou 'light'
    notifications: true,     // true ou false
    soundEnabled: true,      // true ou false
    volume: 80               // 0 à 100
};
export const state = {
    currentUser: null,
    typingTimeout: null,
    oldestMessageId: null,
    hasMoreMessages: true,
    isLoadingHistory: false,
};
