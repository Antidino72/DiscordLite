async function handleCredentialResponse(response) {
    try {
        // Envoi du jeton brut (credential) au serveur sur la route sécurisée /api/login
        const res = await fetch('/api/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: response.credential
            })
        });

        const data = await res.json();
        console.log(data);

        if (res.ok && data.success) {
            window.location.href = "/chat";
        } else {
            console.error(`Erreur serveur (${res.status}) :`, data.error || 'Erreur inconnue');
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}