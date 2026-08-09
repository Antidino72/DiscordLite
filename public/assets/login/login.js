async function handleCredentialResponse(response) {
    const userData = parseJwt(response.credential);

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                google_id: userData.sub,
                image: userData.picture,
                username: userData.name
            })
        });

        if (res.ok) {
            // Sauvegarder le token si besoin
            localStorage.setItem("token", response.credential);

            // ✅ Rediriger vers la route racine "/" gérée par le serveur Express
            window.location.href = "/login";
        } else {
            console.error("Erreur serveur lors de la connexion");
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}