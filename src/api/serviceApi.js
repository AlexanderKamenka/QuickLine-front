import axiosInstance from './axiosConfig';

export const serviceApi = {
    getByBusiness: async (businessId) => {
        const response = await axiosInstance.get(`/api/businesses/${businessId}/services`);
        return response.data;
    },

    getById: async (businessId, serviceId) => {
        const response = await axiosInstance.get(`/api/businesses/${businessId}/services/${serviceId}`);
        return response.data;
    },

    create: async (businessId, data) => {
        const response = await axiosInstance.post(`/api/businesses/${businessId}/services`, data);
        return response.data;
    },

    update: async (businessId, serviceId, data) => {
        const response = await axiosInstance.put(`/api/businesses/${businessId}/services/${serviceId}`, data);
        return response.data;
    },

    delete: async (businessId, serviceId) => {
        await axiosInstance.delete(`/api/businesses/${businessId}/services/${serviceId}`);
    },
};