'use client';
import { useCallback, useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export default function Toast({
    message,
    type = 'success',
    isVisible,
    onClose,
    duration = 3000
}: ToastProps) {
    const [shouldRender, setShouldRender] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClose = useCallback(() => {
        // Trigger exit animation
        setIsAnimating(false);
        // Remove from DOM after animation completes
        setTimeout(() => {
            setShouldRender(false);
            onClose();
        }, 300);
    }, [onClose]);


    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
            // Trigger enter animation
            setTimeout(() => setIsAnimating(true), 10);

            // Auto-hide timer
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, handleClose]);



    if (!shouldRender) return null;

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            case 'info':
                return 'bg-blue-500';
            default:
                return 'bg-green-500';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'info':
                return 'ℹ️';
            default:
                return '✅';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            <div
                className={`${getBackgroundColor()} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm transition-all duration-300 ease-out ${isAnimating
                    ? 'translate-x-0 opacity-100 scale-100'
                    : 'translate-x-full opacity-0 scale-95'
                    }`}
            >
                <span className="text-lg">{getIcon()}</span>
                <span className="font-medium">{message}</span>
                <button
                    onClick={handleClose}
                    className="ml-4 text-white hover:text-gray-200 transition-colors"
                    aria-label="Close"
                >
                    ×
                </button>
            </div>
        </div>
    );
}