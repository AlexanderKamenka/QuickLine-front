import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { queueApi } from '../api/queueApi';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import ServiceList from '../components/service/ServiceList';
import QueueForm from '../components/queue/QueueForm';
import QueueCalendar from '../components/queue/QueueCalendar';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

const ServicesPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation();

    const business = location.state?.business;
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    if (!business) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Business not found</p>
                    <Button onClick={() => navigate('/businesses')}>
                        {t('backToList')}
                    </Button>
                </div>
            </div>
        );
    }

    const handleBookService = (service) => {
        setSelectedService(service);
        setShowBookingModal(true);
    };

    const handleBookingSubmit = async (formData) => {
        try {
            await queueApi.create({
                business: { id: business.id },
                service: { id: selectedService.id },
                client: { id: user.id },
                clientName: formData.clientName,
                clientPhone: formData.clientPhone,
                appointmentTime: formData.appointmentTime,
            });

            setShowBookingModal(false);
            alert(t('success'));
            navigate('/queues');
        } catch (error) {
            throw error;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <Button
                onClick={() => navigate('/businesses')}
                variant="secondary"
                className="mb-6"
            >
                <ArrowLeft size={18} className="inline mr-2" />
                {t('backToList')}
            </Button>

            {/* Business Info */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
                <p className="text-gray-600 mb-4">{business.description}</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                        <span className="font-medium">Address:</span> {business.address}
                    </div>
                    <div>
                        <span className="font-medium">Phone:</span> {business.phoneNumber}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Services List */}
                <div className="lg:col-span-2">
                    <ServiceList
                        business={business}
                        onBookService={handleBookService}
                    />
                </div>

                {/* Calendar Sidebar */}
                {user?.role === 'CLIENT' && (
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <h3 className="text-xl font-bold mb-4">Available Dates</h3>
                            <QueueCalendar
                                businessId={business.id}
                                onSelectDate={setSelectedDate}
                            />
                            {selectedDate && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        Selected date: <strong>{selectedDate}</strong>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            <Modal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                title={t('bookAppointment')}
            >
                <QueueForm
                    business={business}
                    service={selectedService}
                    onSubmit={handleBookingSubmit}
                    onCancel={() => setShowBookingModal(false)}
                />
            </Modal>
        </div>
    );
};

export default ServicesPage;