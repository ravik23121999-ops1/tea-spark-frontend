'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, ArrowLeft, Send, UtensilsCrossed, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/password/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                toast.success('Reset link sent to your email!');
                
                // For development, show the reset URL in console
                if (data.resetUrl) {
                    console.log('Reset URL (for development):', data.resetUrl);
                }
            } else {
                toast.error(data.message || 'Failed to send reset link');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
                {/* Background Decorative Elements */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.08, 0.15, 0.08]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 -left-20 w-96 h-96 rounded-full"
                    style={{ backgroundColor: 'var(--color-primary)', filter: 'blur(100px)' }}
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.08, 0.12, 0.08]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full"
                    style={{ backgroundColor: 'var(--color-accent)', filter: 'blur(80px)' }}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="glass w-full max-w-md p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative z-10 text-center"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
                        <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
                    </div>
                    
                    <h1 className="text-3xl font-bold mb-4">Reset Link Sent!</h1>
                    <p className="opacity-60 mb-8">
                        We've sent a password reset link to your email address. 
                        Please check your inbox and follow the instructions.
                    </p>

                    <div className="space-y-4">
                        <Link href="/login" className="btn-primary w-full inline-flex items-center justify-center gap-2">
                            Back to Login
                        </Link>
                        <button
                            onClick={() => setIsSuccess(false)}
                            className="w-full py-3 text-sm opacity-70 hover:opacity-100 transition-opacity"
                        >
                            Send another link
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
            {/* Background Decorative Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.08, 0.15, 0.08]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/4 -left-20 w-96 h-96 rounded-full"
                style={{ backgroundColor: 'var(--color-primary)', filter: 'blur(100px)' }}
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.08, 0.12, 0.08]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full"
                style={{ backgroundColor: 'var(--color-accent)', filter: 'blur(80px)' }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="glass w-full max-w-md p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <UtensilsCrossed size={32} style={{ color: 'var(--color-secondary)' }} />
                        <span className="text-2xl font-bold tracking-tight">
                            Tea<span className="text-secondary">Spark</span>
                        </span>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
                    <p className="opacity-60">Enter your email to receive a reset link</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="group">
                        <label className="block text-sm font-semibold mb-2 ml-1 opacity-70">Email Address</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 group-focus-within:text-secondary transition-all" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/40 dark:bg-black/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        className="btn-primary w-full flex items-center justify-center gap-2 group mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Sending...
                            </>
                        ) : (
                            <>
                                Send Reset Link <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-8 text-center">
                    <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 hover:text-secondary transition-all">
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
