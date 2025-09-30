import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateRequired } from '../../utils/validators';

const LoginForm = () => {
    const { login, loading } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!validateRequired(formData.username)) {
            newErrors.username = t('error');
        }

        if (!validateRequired(formData.password)) {
            newErrors.password = t('error');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await login(formData.username, formData.password);
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
                label={t('password')}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                autoComplete="current-password"
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
                {loading ? t('loading') : t('login')}
            </Button>

            <div className="text-center">
                <Link to="/register" className="text-blue-600 hover:underline">
                    {t('register')}
                </Link>
            </div>
        </form>
    );
};

export default LoginForm;