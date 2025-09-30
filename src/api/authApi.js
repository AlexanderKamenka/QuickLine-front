import axiosInstance, { setAuthToken } from './axiosConfig';

export const authApi = {
    register: async (username, email, password) => {
        try {
            const response = await axiosInstance.post('/api/auth/register', {
                username,
                email,
                password,
            });

            console.log('Register response:', response.data);

            if (response.data.token) {
                setAuthToken(response.data.token);
            }

            return response.data;
        } catch (error) {
            console.error('Register error:', error.response?.data || error.message);
            throw error;
        }
    },

    login: async (username, password) => {
        try {
            const response = await axiosInstance.post('/api/auth/login', {
                username,
                password,
            });

            console.log('Login response:', response.data);
            console.log('Token received:', response.data.token);

            if (response.data.token) {
                setAuthToken(response.data.token);
            }

            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            throw error;
        }
    },

    logout: () => {
        setAuthToken(null);
    },
};