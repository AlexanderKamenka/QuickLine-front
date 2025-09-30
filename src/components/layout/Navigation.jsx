import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, Scissors, Clock, Calendar, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';

const Navigation = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const NavButton = ({ path, icon: Icon, label }) => {
        const isActive = location.pathname === path;

        return (
            <button
                onClick={() => navigate(path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                }`}
            >
                <Icon size={20} />
                <span>{label}</span>
            </button>
        );
    };

    if (!user) return null;

    return (
        <nav className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    <NavButton path="/" icon={LayoutDashboard} label={t('dashboard')} />
                    <NavButton path="/businesses" icon={Scissors} label={t('businesses')} />
                    <NavButton path="/queues" icon={Clock} label={t('allQueues')} />
                </div>
            </div>
        </nav>
    );
};

export default Navigation;