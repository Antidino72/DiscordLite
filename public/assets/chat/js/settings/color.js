import {getSettings, updateSettings} from "./settings.js";

export function initColor(){
    const color = document.getElementById('color-select');
    color.value = getSettings().color
    document.documentElement.style.setProperty('--bg-primary', getSettings().color);
    color.addEventListener('input', (e) => {
        const selectedColor = e.target.value;
        console.log(selectedColor);
        // 1. Modifier la variable CSS --font
        document.documentElement.style.setProperty('--bg-primary', selectedColor);

        // 2. Sauvegarder la préférence dans ton localStorage
        updateSettings({ color: selectedColor });
    });

}