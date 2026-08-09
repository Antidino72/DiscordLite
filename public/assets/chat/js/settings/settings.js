import {initfont} from "./font.js";
import {initNotification} from "./notification.js";
import {initColor} from "./color.js";

const DEFAULT_SETTINGS = {
    font: 'poppins',
    color : "#313338",
    notifications: false,     // true ou false
    soundEnabled: true,      // true ou false
    volume: 80               // 0 à 100
};
export function initSettings(){
    initfont()
    initNotification()
    initColor()
    const resetBtn = document.getElementById('reset-settings-btn');

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // Optionnel : Demander une confirmation
            if (confirm("Voulez-vous vraiment remettre tous les paramètres par défaut ?")) {
                resetSettings();
            }
        });
    }
}
export function resetSettings() {

    localStorage.setItem('app_settings', JSON.stringify(DEFAULT_SETTINGS));


    document.documentElement.style.setProperty('--font', DEFAULT_SETTINGS.font);
    document.documentElement.style.setProperty('--bg-primary', DEFAULT_SETTINGS.color);


    const fontSelect = document.getElementById('font-select');
    const notifCheckbox = document.getElementById('notification_settings');
    const color = document.getElementById('color-select');

    if (color) color.value =DEFAULT_SETTINGS.color
    if (fontSelect) fontSelect.value = DEFAULT_SETTINGS.font;
    if (notifCheckbox) notifCheckbox.checked = DEFAULT_SETTINGS.notifications;

    console.log("♻️ Paramètres réinitialisés avec succès !");
}
export function getSettings() {
    const saved = localStorage.getItem('app_settings');
    if (!saved) return DEFAULT_SETTINGS;

    try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
        console.error("Erreur lors de la lecture des paramètres, réinitialisation.", e);
        return DEFAULT_SETTINGS;
    }
}
export function updateSettings(newSettings) {
    const current = getSettings();
    const updated = { ...current, ...newSettings }; // On met à jour seulement les clés modifiées

    localStorage.setItem('app_settings', JSON.stringify(updated));
    return updated;
}