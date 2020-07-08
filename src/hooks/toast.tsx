import React, { createContext, useCallback, useContext, useState } from 'react';

import ToastContainer from '../components/ToastContainer';

interface ToatsMessage {
    id: srting;
    type?: 'info' | 'success' | 'error';
    title: string;
    description?: string;
}

interface ToastContextData {
    addToast(): void;
    removeToast(): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
    const [messages, setMessages] = useState<ToatsMessage[]>([]);

    const addToast = useCallback(message => {
        console.log('addToast');
    }, []);

    const removeToast = useCallback(() => {
        console.log('removeToast');
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
};

function useToast(): ToastContextData {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    return context;
}

export { ToastProvider, useToast };
