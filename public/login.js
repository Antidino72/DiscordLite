async function handleCredentialResponse(response) {

    const userData = parseJwt(response.credential)
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            google_id: userData.sub,
            image : userData.picture,
            username: userData.name
        })
    });
    if (res.ok){
        localStorage.setItem("token",response.credential)
        window.location.href = "chat.html"
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