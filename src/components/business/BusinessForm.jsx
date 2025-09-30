import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateRequired } from '../../utils/validators';

const BusinessForm = ({ business, onSubmit, onCancel }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        phoneNumber: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (business) {
            setFormData({
                name: business.name || '',
                description: business.description || '',
                address: business.address || '',
                phoneNumber: business.phoneNumber || '',
            });
        }
    }, [business]);

    const validate = () => {
        const newErrors = {};

        if (!validateRequired(formData.name)) {
            newErrors.name = 'Name is required';
        }

        if (!validateRequired(formData.address)) {
            newErrors.address = 'Address is required';
        }

        if (!validateRequired(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            setErrors({ submit: error.response?.data?.message || t('error') });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label={t('businessName')}
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
            />

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('description')}
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <Input
                label={t('address')}
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                required
            />

            <Input
                label={t('phoneNumber')}
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={errors.phoneNumber}
                required
            />

            {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {errors.submit}
                </div>
            )}

            <div className="flex gap-2 justify-end">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                >
                    {t('cancel')}
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? t('loading') : business ? t('save') : t('create')}
                </Button>
            </div>
        </form>
    );
};

export default BusinessForm;