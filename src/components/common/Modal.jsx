import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({
                   isOpen,
                   onClose,
                   title,
                   children,
                   footer,
                   size = 'md'
               }) => {
    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-lg ${sizes[size]} w-full max-h-[90vh] flex flex-col`}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto flex-1">
                    {children}
                </div>

                {footer && (
                    <div className="flex justify-end gap-2 p-4 border-t">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;