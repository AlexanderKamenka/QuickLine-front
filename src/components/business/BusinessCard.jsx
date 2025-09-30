import React from 'react';
import { MapPin, Phone, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import Button from '../common/Button';

const BusinessCard = ({ business, onEdit, onDelete, onViewServices }) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const isOwner = user?.id === business.ownerId || user?.role === 'OWNER';

    return (
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{business.name}</h3>
                {isOwner && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(business)}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={() => onDelete(business.id)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">{business.description}</p>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} />
                    <span>{business.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone size={16} />
                    <span>{business.phoneNumber}</span>
                </div>
            </div>

            <Button
                onClick={() => onViewServices(business)}
                className="w-full"
            >
                {t('viewServices')}
            </Button>
        </div>
    );
};

export default BusinessCard;