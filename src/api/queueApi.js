import axiosInstance from './axiosConfig';

export const queueApi = {
    create: async (data) => {
        const response = await axiosInstance.post('/api/queues', data);
        return response.data;
    },

    getById: async (id) => {
        const response = await axiosInstance.get(`/api/queues/${id}`);
        return response.data;
    },

    getByBusiness: async (businessId) => {
        const response = await axiosInstance.get(`/api/queues/business/${businessId}`);
        return response.data;
    },

    getByClient: async (userId) => {
        const response = await axiosInstance.get(`/api/queues/client/${userId}`);
        return response.data;
    },

    getByDate: async (businessId, date) => {
        const response = await axiosInstance.get(`/api/queues/business/${businessId}/date/${date}`);
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await axiosInstance.patch(`/api/queues/${id}/status?status=${status}`);
        return response.data;
    },

    delete: async (id) => {
        await axiosInstance.delete(`/api/queues/${id}`);
    },
};