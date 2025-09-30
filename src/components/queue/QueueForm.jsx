import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateRequired, validatePhone } from '../../utils/validators';
import { getCurrentDateTime } from '../../utils/dateUtils';

const QueueForm = ({ business, service, onSubmit, onCancel }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        clientName: '',
        clientPhone: '',
        appointmentTime: getCurrentDateTime(),
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};

        if (!validateRequired(formData.clientName)) {
            newErrors.clientName = 'Client name is required';
        }

        if (!validatePhone(formData.clientPhone)) {
            newErrors.clientPhone = 'Valid phone number is required';
        }

        if (!validateRequired(formData.appointmentTime)) {
            newErrors.appointmentTime = 'Appointment time is required';
        }

        const appointmentDate = new Date(formData.appointmentTime);
        const now = new Date();
        if (appointmentDate < now) {
            newErrors.appointmentTime = 'Appointment time cannot be in the past';
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
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-blue-900 mb-2">{business?.name}</h4>
                <p className="text-blue-800">{service?.name}</p>
                <div className="flex justify-between mt-2 text-sm text-blue-700">
                    <span>${service?.price}</span>
                    <span>{service?.durationMinutes} minutes</span>
                </div>
            </div>

            <Input
                label={t('clientName')}
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                error={errors.clientName}
                required
                placeholder="John Doe"
            />

            <Input
                label={t('clientPhone')}
                name="clientPhone"
                type="tel"
                value={formData.clientPhone}
                onChange={handleChange}
                error={errors.clientPhone}
                required
                placeholder="+1234567890"
            />

            <Input
                label={t('appointmentTime')}
                name="appointmentTime"
                type="datetime-local"
                value={formData.appointmentTime}
                onChange={handleChange}
                error={errors.appointmentTime}
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
                    {loading ? t('loading') : t('bookAppointment')}
                </Button>
            </div>
        </form>
    );
};

export default QueueForm;