import axios from 'axios';
import { getCookie, deleteCookie } from 'cookies-next';

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

// Interceptor to handle expired/invalid tokens globally
api.interceptors.response.use(
    // Pass successful responses through unchanged
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const requestUrl = error?.config?.url ?? '';

        // If we got a 401 and it's NOT the logout endpoint itself
        // (to avoid an infinite loop if logout returns 401)
        if (status === 401 && !requestUrl.includes('/auth/token/logout/')) {
            // Clear the cookie without going through React context
            deleteCookie('token', { path: '/' });

            // Hard redirect — remounts the React tree so context resets cleanly
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/signin';
            }
        }

        // Always re-throw so individual catch blocks can still handle errors
        return Promise.reject(error);
    }
);
export async function getServerApi(cookies:()=>Promise<any> ){
    const token = await getCookie("token",{ cookies })
    return axios.create({
        baseURL: 'http://127.0.0.1:8000/',
        headers:{
            Authorization:`Token ${token}`
        }
    });
}
export default api;