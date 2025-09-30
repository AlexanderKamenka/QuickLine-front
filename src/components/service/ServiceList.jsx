import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { serviceApi } from '../../api/serviceApi';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import ServiceForm from './ServiceForm';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Loader from '../common/Loader';

const ServiceList = ({ business, onBookService }) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const isOwner = user?.id === business?.ownerId || user?.role === 'OWNER';

    useEffect(() => {
        if (business) {
            loadServices();
        }
    }, [business]);

    const loadServices = async () => {
        setLoading(true);
        try {
            const data = await serviceApi.getByBusiness(business.id);
            setServices(data);
        } catch (error) {
            console.error('Error loading services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedService(null);
        setShowModal(true);
    };

    const handleEdit = (service) => {
        setSelectedService(service);
        setShowModal(true);
    };

    const handleDelete = async (serviceId) => {
        if (!window.confirm(t('confirmDelete'))) return;

        try {
            await serviceApi.delete(business.id, serviceId);
            loadServices();
        } catch (error) {
            alert(t('error'));
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedService) {
                await serviceApi.update(business.id, selectedService.id, formData);
            } else {
                await serviceApi.create(business.id, formData);
            }
            setShowModal(false);
            loadServices();
        } catch (error) {
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{t('services')}</h3>
                {isOwner && (
                    <Button onClick={handleCreate} size="sm">
                        <Plus size={18} className="inline mr-2" />
                        {t('createService')}
                    </Button>
                )}
            </div>

            {services.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">{t('noServices')}</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map(service => (
                        <div key={service.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-lg">{service.name}</h4>
                                {isOwner && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>

                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-1 text-blue-600 font-bold text-lg">
                                    <DollarSign size={18} />
                                    <span>{service.price}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-500 text-sm">
                                    <Clock size={16} />
                                    <span>{service.durationMinutes} min</span>
                                </div>
                            </div>

                            {user?.role === 'CLIENT' && (
                                <Button
                                    onClick={() => onBookService(service)}
                                    className="w-full"
                                    size="sm"
                                >
                                    {t('bookAppointment')}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={selectedService ? t('editService') : t('createService')}
            >
                <ServiceForm
                    service={selectedService}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowModal(false)}
                />
            </Modal>
        </div>
    );
};

export default ServiceList;