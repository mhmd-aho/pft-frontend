import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
});

// Interceptor to attach the Djoser token to every request
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        // Djoser/DRF TokenAuth expects the "Token" prefix
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export default api;