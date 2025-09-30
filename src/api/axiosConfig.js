import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

let token = null;

export const setAuthToken = (newToken) => {
    token = newToken;
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('✅ Token set successfully');
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
        console.log('❌ Token removed');
    }
};

export const getAuthToken = () => token;

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        console.log(`🔹 ${config.method.toUpperCase()} ${config.url}`);
        if (config.headers.Authorization) {
            console.log('🔑 Authorization header present');
        } else {
            console.warn('⚠️ No authorization header!');
        }
        return config;
    },
    (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        console.log(`✅ Response from ${response.config.url}:`, response.status);
        return response;
    },
    (error) => {
        const errorInfo = {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        };

        console.error('❌ Response error:', errorInfo);

        if (error.response?.status === 401) {
            console.error('🔒 Unauthorized - redirecting to login');
            setAuthToken(null);
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;