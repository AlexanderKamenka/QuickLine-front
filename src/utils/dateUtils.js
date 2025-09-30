import { format, parse, isValid } from 'date-fns';

export const formatDate = (date, formatStr = 'yyyy-MM-dd') => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return isValid(dateObj) ? format(dateObj, formatStr) : '';
};

export const formatDateTime = (date) => {
    return formatDate(date, 'yyyy-MM-dd HH:mm');
};

export const formatTime = (date) => {
    return formatDate(date, 'HH:mm');
};

export const parseDate = (dateString, formatStr = 'yyyy-MM-dd') => {
    return parse(dateString, formatStr, new Date());
};

export const getCurrentDate = () => {
    return formatDate(new Date());
};

export const getCurrentDateTime = () => {
    return formatDateTime(new Date());
};