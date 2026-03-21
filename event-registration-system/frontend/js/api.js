const API_BASE_URL = 'http://localhost:8000/api';

function getAuthToken() {
    return localStorage.getItem('token');
}

function setAuthToken(token, username) {
    localStorage.setItem('token', token);
    if(username) localStorage.setItem('username', username);
}

function removeAuthToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
}

async function apiFetch(endpoint, options = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const token = getAuthToken();
    if (token) {
        defaultHeaders['Authorization'] = `Token ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    });

    return response;
}

async function fetchEvents() {
    const response = await apiFetch('/events/');
    if (!response.ok) throw new Error('Failed to fetch events');
    return await response.json();
}

function updateNavigation() {
    const token = getAuthToken();
    const navLinks = document.getElementById('nav-links');
    
    if (token) {
        navLinks.innerHTML = `
            <li><a href="index.html">Events</a></li>
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="#" onclick="logout(event)" class="auth-btn">Logout</a></li>
        `;
    } else {
        navLinks.innerHTML = `
            <li><a href="index.html">Events</a></li>
            <li><a href="login.html">Login</a></li>
            <li><a href="register.html" class="auth-btn">Register</a></li>
        `;
    }
}

function logout(e) {
    if(e) e.preventDefault();
    removeAuthToken();
    window.location.href = 'index.html';
}

function requireAuth() {
    if(!getAuthToken()) {
        window.location.href = 'login.html';
    }
}
