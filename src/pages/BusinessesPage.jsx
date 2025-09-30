import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BusinessList from '../components/business/BusinessList';

const BusinessesPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSelectBusiness = (business) => {
        navigate(`/businesses/${business.id}/services`, { state: { business } });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{t('businesses')}</h1>
                <p className="text-gray-600">
                    Browse and manage beauty salons
                </p>
            </div>

            <BusinessList onSelectBusiness={handleSelectBusiness} />
        </div>
    );
};

export default BusinessesPage;