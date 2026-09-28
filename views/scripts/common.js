// Sayfalar arasında paylaşılan yardımcılar

function getToken() {
    return localStorage.getItem("token");
}

function decodeToken(token) {
    try {
        const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(payload));
    } catch (e) {
        return null;
    }
}

// Token yoksa veya süresi dolmuşsa giriş sayfasına yönlendirir
function requireLogin() {
    const token = getToken();
    const decoded = token && decodeToken(token);
    if (!decoded || (decoded.exp && decoded.exp * 1000 < Date.now())) {
        localStorage.removeItem("token");
        window.location.href = "user.html";
        return null;
    }
    return { token, userId: decoded.userId };
}

// Token'ı ekleyerek API çağrısı yapar, hata durumunda sunucunun mesajıyla Error fırlatır
async function apiFetch(url, options = {}) {
    const headers = Object.assign({}, options.headers, { 'x-auth-token': getToken() || "" });
    const response = await fetch(url, Object.assign({}, options, { headers }));
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "user.html";
    }
    if (!response.ok) {
        throw new Error(data.message || response.statusText);
    }
    return data;
}
