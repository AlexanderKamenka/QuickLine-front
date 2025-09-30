import React from 'react';

const Loader = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    return (
        <div className={`flex justify-center items-center ${className}`}>
            <div className={`${sizes[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
        </div>
    );
};

export default Loader;