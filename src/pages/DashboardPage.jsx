import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Calendar, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';

const DashboardPage = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const StatCard = ({ icon: Icon, title, value, color, description }) => (
        <div className={`bg-gradient-to-br ${color} text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow`}>
            <div className="flex items-center justify-between mb-4">
                <Icon size={48} className="opacity-90" />
                <span className="text-3xl font-bold">{value}</span>
            </div>
            <h3 className="text-xl font-bold mb-1">{title}</h3>
            <p className="text-sm opacity-90">{description}</p>
        </div>
    );

    const QuickActionCard = ({ icon: Icon, title, description, onClick, color }) => (
        <button
            onClick={onClick}
            className={`bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all hover:-translate-y-1 text-left w-full`}
        >
            <div className={`${color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                <Icon size={24} className="text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </button>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">{t('welcome')}, {user?.username}! 👋</h1>
                <p className="text-gray-600 text-lg">
                    Manage your beauty salons and track appointments
                </p>
            </div>

            {/* Stats Section */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                    icon={Scissors}
                    title={t('businesses')}
                    value="0"
                    color="from-blue-500 to-blue-600"
                    description="Total salons managed"
                />
                <StatCard
                    icon={Calendar}
                    title="Today's Appointments"
                    value="0"
                    color="from-purple-500 to-purple-600"
                    description="Scheduled for today"
                />
                <StatCard
                    icon={TrendingUp}
                    title="This Month"
                    value="0"
                    color="from-green-500 to-green-600"
                    description="Total appointments"
                />
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickActionCard
                        icon={Scissors}
                        title={t('createBusiness')}
                        description="Add a new salon to your portfolio"
                        onClick={() => navigate('/businesses')}
                        color="bg-blue-600"
                    />
                    <QuickActionCard
                        icon={Users}
                        title="Manage Services"
                        description="Update your service offerings"
                        onClick={() => navigate('/businesses')}
                        color="bg-purple-600"
                    />
                    <QuickActionCard
                        icon={Calendar}
                        title="View Appointments"
                        description="Check today's schedule"
                        onClick={() => navigate('/queues')}
                        color="bg-green-600"
                    />
                    <QuickActionCard
                        icon={TrendingUp}
                        title="Analytics"
                        description="View business insights"
                        onClick={() => alert('Coming soon!')}
                        color="bg-orange-600"
                    />
                </div>
            </div>

            {/* Getting Started Guide */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Getting Started Guide</h2>

                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                            1
                        </div>
                        <div>
                            <h3 className="font-bold mb-1">Create Your Salon</h3>
                            <p className="text-gray-600">Add your beauty salon with details like name, address, and contact information.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                            2
                        </div>
                        <div>
                            <h3 className="font-bold mb-1">Add Services</h3>
                            <p className="text-gray-600">List all services you offer with prices and duration.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                            3
                        </div>
                        <div>
                            <h3 className="font-bold mb-1">Manage Appointments</h3>
                            <p className="text-gray-600">View client bookings, confirm appointments, and update statuses.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                            4
                        </div>
                        <div>
                            <h3 className="font-bold mb-1">Track Performance</h3>
                            <p className="text-gray-600">Monitor your business metrics and client satisfaction.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;