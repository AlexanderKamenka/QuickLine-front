import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { queueApi } from '../../api/queueApi';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { formatDateTime } from '../../utils/dateUtils';

const QueueList = ({ isOwnerView = false, businessId = null }) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [queues, setQueues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        loadQueues();
    }, [businessId, isOwnerView]);

    const loadQueues = async () => {
        setLoading(true);
        try {
            let data;
            if (isOwnerView && businessId) {
                data = await queueApi.getByBusiness(businessId);
            } else if (isOwnerView) {
                // Загрузить все очереди для всех бизнесов владельца
                data = await queueApi.getByBusiness(1); // Placeholder
            } else {
                data = await queueApi.getByClient(user.id);
            }
            setQueues(data);
        } catch (error) {
            console.error('Error loading queues:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await queueApi.updateStatus(id, status);
            loadQueues();
        } catch (error) {
            alert(t('error'));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('confirmDelete'))) return;

        try {
            await queueApi.delete(id);
            loadQueues();
        } catch (error) {
            alert(t('error'));
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'CONFIRMED':
                return <CheckCircle className="text-blue-600" size={20} />;
            case 'COMPLETED':
                return <CheckCircle className="text-green-600" size={20} />;
            case 'CANCELLED':
                return <XCircle className="text-red-600" size={20} />;
            default:
                return <AlertCircle className="text-yellow-600" size={20} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CONFIRMED':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'COMPLETED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const filteredQueues = filter === 'ALL'
        ? queues
        : queues.filter(q => q.status === filter);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant={filter === 'ALL' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setFilter('ALL')}
                    >
                        All ({queues.length})
                    </Button>
                    <Button
                        variant={filter === 'PENDING' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setFilter('PENDING')}
                    >
                        {t('pending')} ({queues.filter(q => q.status === 'PENDING').length})
                    </Button>
                    <Button
                        variant={filter === 'CONFIRMED' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setFilter('CONFIRMED')}
                    >
                        {t('confirmed')} ({queues.filter(q => q.status === 'CONFIRMED').length})
                    </Button>
                    <Button
                        variant={filter === 'COMPLETED' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setFilter('COMPLETED')}
                    >
                        {t('completed')} ({queues.filter(q => q.status === 'COMPLETED').length})
                    </Button>
                </div>
            </div>

            {filteredQueues.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">{t('noQueues')}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredQueues.map(queue => (
                        <div key={queue.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-bold text-lg">{queue.business?.name}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(queue.status)} flex items-center gap-1`}>
                      {getStatusIcon(queue.status)}
                                            {t(queue.status.toLowerCase())}
                    </span>
                                    </div>

                                    <p className="text-gray-600 mb-3">{queue.service?.name}</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <User size={16} />
                                            <span>{queue.clientName}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Phone size={16} />
                                            <span>{queue.clientPhone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar size={16} />
                                            <span>{formatDateTime(queue.appointmentTime)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock size={16} />
                                            <span>{queue.service?.durationMinutes} min</span>
                                        </div>
                                    </div>
                                </div>

                                {isOwnerView && queue.status !== 'COMPLETED' && queue.status !== 'CANCELLED' && (
                                    <div className="flex flex-wrap gap-2">
                                        {queue.status === 'PENDING' && (
                                            <Button
                                                onClick={() => handleStatusUpdate(queue.id, 'CONFIRMED')}
                                                variant="success"
                                                size="sm"
                                            >
                                                <CheckCircle size={16} className="inline mr-1" />
                                                {t('confirmed')}
                                            </Button>
                                        )}
                                        {(queue.status === 'PENDING' || queue.status === 'CONFIRMED') && (
                                            <Button
                                                onClick={() => handleStatusUpdate(queue.id, 'COMPLETED')}
                                                variant="primary"
                                                size="sm"
                                            >
                                                {t('completed')}
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => handleStatusUpdate(queue.id, 'CANCELLED')}
                                            variant="danger"
                                            size="sm"
                                        >
                                            <XCircle size={16} className="inline mr-1" />
                                            {t('cancelled')}
                                        </Button>
                                    </div>
                                )}

                                {!isOwnerView && (queue.status === 'PENDING' || queue.status === 'CONFIRMED') && (
                                    <Button
                                        onClick={() => handleDelete(queue.id)}
                                        variant="danger"
                                        size="sm"
                                    >
                                        {t('cancel')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QueueList;