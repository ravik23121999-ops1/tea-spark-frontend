'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, HelpCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'success' | 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'info',
    isLoading = false
}: ConfirmationModalProps) {
    const getConfig = () => {
        switch (type) {
            case 'success':
                return { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', darkBg: 'dark:bg-green-500/10', btn: 'bg-green-500 hover:bg-green-600 shadow-green-500/20' };
            case 'danger':
                return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', darkBg: 'dark:bg-red-500/10', btn: 'bg-red-500 hover:bg-red-600 shadow-red-500/20' };
            case 'warning':
                return { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50', darkBg: 'dark:bg-orange-500/10', btn: 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20' };
            default:
                return { icon: HelpCircle, color: 'text-secondary', bg: 'bg-secondary/5', darkBg: 'dark:bg-secondary/10', btn: 'bg-secondary hover:bg-secondary/90 shadow-secondary/20' };
        }
    };

    const config = getConfig();
    const Icon = config.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors px-8 py-10"
                    >
                        <div className="text-center">
                            <div className={`w-20 h-20 ${config.bg} ${config.darkBg} rounded-3xl flex items-center justify-center mx-auto mb-6`}>
                                <Icon size={40} className={config.color} />
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                            <p className="text-slate-500 dark:text-slate-300 mb-8 whitespace-pre-line">
                                {message}
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={`w-full py-4 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 ${config.btn}`}
                                >
                                    {isLoading ? 'Processing...' : confirmText}
                                </button>
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                                >
                                    {cancelText}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
