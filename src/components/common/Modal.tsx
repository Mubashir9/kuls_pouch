import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 0 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }} // Subtle drop when closing
                            transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
                            className="bg-surface/95 backdrop-blur-xl w-full max-w-lg rounded-2xl shadow-2xl border border-white/20 dark:border-black/20 pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-border">
                                <h2 className="text-xl font-bold text-text-primary">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-text-secondary"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
