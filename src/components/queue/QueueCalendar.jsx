import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { queueApi } from '../../api/queueApi';
import { useTranslation } from '../../hooks/useTranslation';
import { formatDate } from '../../utils/dateUtils';

const QueueCalendar = ({ businessId, onSelectDate }) => {
    const { t } = useTranslation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [queueCounts, setQueueCounts] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadQueueCounts();
    }, [currentDate, businessId]);

    const loadQueueCounts = async () => {
        if (!businessId) return;

        setLoading(true);
        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            const counts = {};

            // Загрузить количество записей для каждого дня месяца
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const dateStr = formatDate(date);
                try {
                    const queues = await queueApi.getByDate(businessId, dateStr);
                    counts[dateStr] = queues.length;
                } catch (error) {
                    counts[dateStr] = 0;
                }
            }

            setQueueCounts(counts);
        } catch (error) {
            console.error('Error loading queue counts:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleDateClick = (day) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateStr = formatDate(date);
        setSelectedDate(dateStr);
        if (onSelectDate) {
            onSelectDate(dateStr);
        }
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>

                <h3 className="text-lg font-bold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>

                <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {dayNames.map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                        {day}
                    </div>
                ))}

                {emptyDays.map(i => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {days.map(day => {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const dateStr = formatDate(date);
                    const isToday = formatDate(new Date()) === dateStr;
                    const isSelected = selectedDate === dateStr;
                    const count = queueCounts[dateStr] || 0;
                    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                    return (
                        <button
                            key={day}
                            onClick={() => !isPast && handleDateClick(day)}
                            disabled={isPast}
                            className={`aspect-square p-2 rounded-lg text-center transition-colors relative ${
                                isPast
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : isSelected
                                        ? 'bg-blue-600 text-white font-bold'
                                        : isToday
                                            ? 'bg-blue-100 text-blue-900 font-bold'
                                            : 'hover:bg-gray-100'
                            }`}
                        >
                            <span className="text-sm">{day}</span>
                            {count > 0 && !isPast && (
                                <span className={`absolute top-1 right-1 text-xs ${
                                    isSelected ? 'text-white' : 'text-blue-600'
                                }`}>
                  {count}
                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {loading && (
                <div className="mt-4 text-center text-sm text-gray-500">
                    {t('loading')}
                </div>
            )}
        </div>
    );
};

export default QueueCalendar;