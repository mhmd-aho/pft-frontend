import axios from 'axios';
import { getCookie } from 'cookies-next';
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
});

// Interceptor to attach the Djoser token to every request
api.interceptors.request.use((config) => {
    const token = getCookie("token");
    if (token) {
        // Djoser/DRF TokenAuth expects the "Token" prefix
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export default api;