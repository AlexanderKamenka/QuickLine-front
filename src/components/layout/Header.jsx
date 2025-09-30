import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import Button from '../common/Button';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { t, language, setLanguage } = useTranslation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => isAuthenticated && navigate('/')}
                    >
                        <Scissors size={32} />
                        <h1 className="text-xl md:text-2xl font-bold">{t('appName')}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-blue-700 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            <option value="en">English</option>
                            <option value="ru">Русский</option>
                        </select>

                        {user && (
                            <>
                                <div className="hidden md:block text-right">
                                    <div className="font-medium">{user.username}</div>
                                    <div className="text-xs text-blue-200">{t(user.role?.toLowerCase() || 'client')}</div>
                                </div>
                                <Button
                                    onClick={handleLogout}
                                    variant="secondary"
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <LogOut size={18} />
                                    <span className="hidden md:inline">{t('logout')}</span>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;