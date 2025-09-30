import axiosInstance from './axiosConfig';

export const businessApi = {
    // Получить все бизнесы конкретного владельца
    getAll: async (ownerId) => {
        try {
            const response = await axiosInstance.get(`/api/businesses/owner/${ownerId}`);
            return response.data;
        } catch (error) {
            console.error('Error in getAll:', error.response?.data || error.message);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await axiosInstance.get(`/api/businesses/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error in getById:', error.response?.data || error.message);
            throw error;
        }
    },

    getByOwner: async (ownerId) => {
        try {
            const response = await axiosInstance.get(`/api/businesses/owner/${ownerId}`);
            return response.data;
        } catch (error) {
            console.error('Error in getByOwner:', error.response?.data || error.message);
            throw error;
        }
    },

    create: async (data) => {
        try {
            console.log('Creating business with data:', data);
            const response = await axiosInstance.post('/api/businesses', data);
            console.log('Business created:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating business:', error.response?.data || error.message);
            throw error;
        }
    },

    update: async (id, data) => {
        try {
            console.log('Updating business:', id, data);
            const response = await axiosInstance.put(`/api/businesses/${id}`, data);
            console.log('Business updated:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating business:', error.response?.data || error.message);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            console.log('Deleting business:', id);
            await axiosInstance.delete(`/api/businesses/${id}`);
            console.log('Business deleted successfully');
        } catch (error) {
            console.error('Error deleting business:', error.response?.data || error.message);
            throw error;
        }
    },
};