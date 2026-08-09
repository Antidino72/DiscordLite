async function checkAndLoginWithStoredToken() {
    // 1. On récupère le token stocké dans le localStorage
    const storedToken = localStorage.getItem('token');

    // 2. Si AUCUN token n'existe en local, on ne fait rien (l'utilisateur reste sur la page)
    if (!storedToken) {
        console.log("Aucun token trouvé dans le localStorage.");
        return;
    }

    // 3. S'il existe, on l'envoie au serveur pour vérification
    try {
        const res = await fetch('/api/google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: storedToken })
        });

        if (res.ok) {
            // Token valide -> Redirection vers le chat !
            window.location.href = '/chat';
        } else {
            // Le token stocké n'est plus valide/expiré -> On le nettoie du localStorage
            console.warn("Token expiré ou invalide. Nettoyage du localStorage.");
            localStorage.removeItem('google_id_token');
        }
    } catch (error) {
        console.error("Erreur lors de la vérification du token :", error);
    }
}

// Tu peux exécuter cette fonction au chargement de ta page de login :
document.addEventListener('DOMContentLoaded', checkAndLoginWithStoredToken);