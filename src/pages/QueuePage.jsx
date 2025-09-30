import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import QueueList from '../components/queue/QueueList';

const QueuePage = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const isOwner = user?.role === 'OWNER';

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">
                    {isOwner ? t('allQueues') : t('myQueues')}
                </h1>
                <p className="text-gray-600">
                    {isOwner
                        ? 'Manage all appointments for your salons'
                        : 'View and manage your upcoming appointments'}
                </p>
            </div>

            <QueueList isOwnerView={isOwner} />
        </div>
    );
};

export default QueuePage;