const BASE_URL = import.meta.env.VITE_API_URL;
const PROJECT_KEY = import.meta.env.VITE_PROJECT_KEY;

export const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('auth_token');

    const headers = {
        'Content-Type': 'application/json',
        'X-Project-Key': PROJECT_KEY,
    };

    if (token) {
        headers['X-Auth-Token'] = token;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || 'Une erreur est survenue');
    }

    return data;
};
