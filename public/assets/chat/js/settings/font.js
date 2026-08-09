import {getSettings, updateSettings} from "./settings.js";

export function initfont(){
    const fontSelect = document.getElementById('font-select');
    fontSelect.value = getSettings().font
    document.documentElement.style.setProperty('--font', getSettings().font);
    fontSelect.addEventListener('change', (e) => {
        const selectedFont = e.target.value;

        // 1. Modifier la variable CSS --font
        document.documentElement.style.setProperty('--font', selectedFont);

        // 2. Sauvegarder la préférence dans ton localStorage
        updateSettings({ font: selectedFont });
    });



    //==========================//
    //      Font Size           //
    //==========================//
    document.getElementById('font-size-select').addEventListener('change', (e) => {
        document.documentElement.style.setProperty('--font-size', e.target.value);
        updateSettings({ fontSize: e.target.value });
    });
}