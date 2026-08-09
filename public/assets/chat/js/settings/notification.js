import {getSettings,updateSettings} from "./settings.js";

export function requestNotificationPermission() {
    if (Notification.permission !== "granted") {
        updateSettings({ notifications: false });
    }
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                updateSettings({ notifications: true });
            }
        });
    }
}
export function showNotification(title, body, icon) {
    if (getSettings().notification && document.hidden && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: icon || '/api/image/send'
        });
    }
}
export function initNotification() {
    const notifCheckbox = document.getElementById('notification-setting'); // Ou ton sélecteur DOM
    if (!notifCheckbox) return;
    notifCheckbox.checked = getSettings().notifications;
    notifCheckbox.addEventListener('change', (e) => {
        updateSettings({ notifications: e.target.checked });
    });
}