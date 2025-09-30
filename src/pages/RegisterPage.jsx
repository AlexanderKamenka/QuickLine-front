import React from 'react';
import { Scissors } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <Scissors size={48} className="text-blue-600" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center mb-2">{t('register')}</h2>
                <p className="text-center text-gray-600 mb-6">Create your account to get started</p>

                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;