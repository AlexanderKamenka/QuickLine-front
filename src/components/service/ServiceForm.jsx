import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateRequired, validatePositiveNumber } from '../../utils/validators';

const ServiceForm = ({ service, onSubmit, onCancel }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        durationMinutes: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (service) {
            setFormData({
                name: service.name || '',
                description: service.description || '',
                price: service.price || '',
                durationMinutes: service.durationMinutes || '',
            });
        }
    }, [service]);

    const validate = () => {
        const newErrors = {};

        if (!validateRequired(formData.name)) {
            newErrors.name = 'Service name is required';
        }

        if (!validatePositiveNumber(formData.price)) {
            newErrors.price = 'Price must be a positive number';
        }

        if (!validatePositiveNumber(formData.durationMinutes)) {
            newErrors.durationMinutes = 'Duration must be a positive number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            await onSubmit({
                ...formData,
                price: parseFloat(formData.price),
                durationMinutes: parseInt(formData.durationMinutes),
            });
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
                label={t('serviceName')}
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
                label={t('price')}
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                required
            />

            <Input
                label={t('duration')}
                name="durationMinutes"
                type="number"
                value={formData.durationMinutes}
                onChange={handleChange}
                error={errors.durationMinutes}
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
                    {loading ? t('loading') : service ? t('save') : t('create')}
                </Button>
            </div>
        </form>
    );
};

export default ServiceForm;