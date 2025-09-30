import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateRequired, validateEmail, validateMinLength } from '../../utils/validators';

const RegisterForm = () => {
    const { register, loading } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!validateRequired(formData.username)) {
            newErrors.username = t('error');
        }

        if (!validateEmail(formData.email)) {
            newErrors.email = t('error');
        }

        if (!validateMinLength(formData.password, 6)) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await register(formData.username, formData.email, formData.password);
            navigate('/');
        } catch (error) {
            setErrors({ submit: error.response?.data?.message || t('error') });
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
                label={t('username')}
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                required
                autoComplete="username"
            />

            <Input
                label={t('email')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                autoComplete="email"
            />

            <Input
                label={t('password')}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                autoComplete="new-password"
            />

            <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
            />

            {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {errors.submit}
                </div>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={loading}
            >
                {loading ? t('loading') : t('register')}
            </Button>

            <div className="text-center">
                <Link to="/login" className="text-blue-600 hover:underline">
                    {t('login')}
                </Link>
            </div>
        </form>
    );
};

export default RegisterForm;