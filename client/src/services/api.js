import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081/api',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user && user.id) {
                    config.headers['X-User-Id'] = user.id;
                }
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
