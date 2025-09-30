import React, { useState, useEffect } from 'react';
import { Plus, Scissors } from 'lucide-react';
import { businessApi } from '../../api/businessApi';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import BusinessCard from './BusinessCard';
import BusinessForm from './BusinessForm';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Loader from '../common/Loader';

const BusinessList = ({ onSelectBusiness }) => {
    const { user, isAuthenticated } = useAuth();
    const { t } = useTranslation();
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState(null);

    // DEBUG - Показываем информацию о пользователе
    console.log('BusinessList render - isAuthenticated:', isAuthenticated);
    console.log('BusinessList render - user:', user);
    console.log('BusinessList render - user.id:', user?.id);

    useEffect(() => {
        console.log('BusinessList useEffect triggered');
        console.log('User in useEffect:', user);
        console.log('User ID in useEffect:', user?.id);

        if (user?.id) {
            loadBusinesses();
        } else {
            console.warn('No user ID, skipping business load');
            setLoading(false);
        }
    }, [user]);

    const loadBusinesses = async () => {
        if (!user?.id) {
            console.error('No user ID available in loadBusinesses');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            console.log('Loading businesses for owner ID:', user.id);
            const data = await businessApi.getByOwner(user.id);
            console.log('Businesses loaded:', data);
            setBusinesses(data);
        } catch (error) {
            console.error('Error loading businesses:', error);
            setError(error.response?.data?.message || 'Failed to load businesses');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        console.log('Creating new business for user:', user);
        setSelectedBusiness(null);
        setShowModal(true);
    };

    const handleEdit = (business) => {
        console.log('Editing business:', business);
        setSelectedBusiness(business);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('confirmDelete'))) return;

        try {
            await businessApi.delete(id);
            alert('Business deleted successfully');
            loadBusinesses();
        } catch (error) {
            console.error('Error deleting business:', error);
            alert(error.response?.data?.message || t('error'));
        }
    };

    const handleSubmit = async (formData) => {
        try {
            console.log('Submitting business form with user ID:', user.id);

            if (selectedBusiness) {
                await businessApi.update(selectedBusiness.id, formData);
                alert('Business updated successfully');
            } else {
                const businessData = {
                    ...formData,
                    owner: {
                        id: user.id
                    }
                };
                console.log('Creating business with data:', businessData);
                await businessApi.create(businessData);
                alert('Business created successfully');
            }
            setShowModal(false);
            setSelectedBusiness(null);
            loadBusinesses();
        } catch (error) {
            console.error('Error submitting business:', error);
            alert(error.response?.data?.message || 'Failed to save business');
            throw error;
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBusiness(null);
    };

    // DEBUG INFO
    if (!isAuthenticated || !user) {
        return (
            <div className="text-center py-12">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto mb-4">
                    <p className="text-yellow-800 font-medium mb-2">Debug Info:</p>
                    <p className="text-sm">isAuthenticated: {String(isAuthenticated)}</p>
                    <p className="text-sm">user: {user ? JSON.stringify(user) : 'null'}</p>
                </div>
                <p className="text-gray-500">Please log in to view businesses</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-64">
                <Loader />
                <p className="mt-4 text-gray-600">Loading salons for user {user.id}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    <p className="text-red-800 font-medium mb-2">Error loading businesses</p>
                    <p className="text-red-600 text-sm mb-4">{error}</p>
                    <Button onClick={loadBusinesses} variant="danger">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold">{t('businesses')}</h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Manage your beauty salons (User ID: {user.id})
                    </p>
                </div>
                <Button onClick={handleCreate} className="whitespace-nowrap">
                    <Plus size={18} className="inline mr-2" />
                    {t('createBusiness')}
                </Button>
            </div>

            {businesses.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow">
                    <Scissors size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg mb-2">{t('noBusinesses')}</p>
                    <p className="text-gray-400 text-sm mb-6">
                        Create your first salon to get started
                    </p>
                    <Button onClick={handleCreate} size="lg">
                        <Plus size={20} className="inline mr-2" />
                        {t('createBusiness')}
                    </Button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {businesses.map(business => (
                        <BusinessCard
                            key={business.id}
                            business={business}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onViewServices={onSelectBusiness}
                        />
                    ))}
                </div>
            )}

            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={selectedBusiness ? t('editBusiness') : t('createBusiness')}
            >
                <BusinessForm
                    business={selectedBusiness}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default BusinessList;