'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, CheckCircle2, UtensilsCrossed, Eye, EyeOff, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState('');
    const [userType, setUserType] = useState('');
    const [isTokenValid, setIsTokenValid] = useState(true);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        const typeParam = searchParams.get('type');

        if (!tokenParam || !typeParam) {
            setIsTokenValid(false);
            toast.error('Invalid reset link');
            return;
        }

        setToken(tokenParam);
        setUserType(typeParam);
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/password/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    newPassword,
                    userType
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Password reset successfully!');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                toast.error(data.message || 'Failed to reset password');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isTokenValid) {
        return (
            <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="glass w-full max-w-md p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative z-10 text-center"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
                        <AlertCircle size={32} className="text-red-600 dark:text-red-400" />
                    </div>
                    
                    <h1 className="text-3xl font-bold mb-4">Invalid Reset Link</h1>
                    <p className="opacity-60 mb-8">
                        This password reset link is invalid or has expired. 
                        Please request a new reset link.
                    </p>

                    <div className="space-y-4">
                        <Link href="/forgot-password" className="btn-primary w-full inline-flex items-center justify-center">
                            Request New Link
                        </Link>
                        <Link href="/login" className="w-full py-3 text-sm opacity-70 hover:opacity-100 transition-opacity inline-block">
                            Back to Login
                        </Link>
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
                    scale: [1, 1.3, 1],
                    rotate: [0, 90, 0],
                    opacity: [0.08, 0.15, 0.08]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-20 -right-20 w-96 h-96 rounded-full"
                style={{ backgroundColor: 'var(--color-secondary)', filter: 'blur(100px)' }}
            />
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.08, 0.12, 0.08]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full"
                style={{ backgroundColor: 'var(--color-primary)', filter: 'blur(80px)' }}
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
                    <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
                    <p className="opacity-60">Create a new secure password for your account</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* New Password Input */}
                        <div className="group">
                            <label className="block text-sm font-semibold mb-2 ml-1 opacity-70">New Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 group-focus-within:text-secondary transition-all" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-white/40 dark:bg-black/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-12 outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all font-medium"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="group">
                            <label className="block text-sm font-semibold mb-2 ml-1 opacity-70">Confirm New Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 group-focus-within:text-secondary transition-all" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-white/40 dark:bg-black/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-12 outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all font-medium"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
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
                                Updating...
                            </>
                        ) : (
                            <>
                                Update Password <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-8 text-center text-sm opacity-70">
                    Remembered your password?{' '}
                    <Link href="/login" className="font-bold text-secondary hover:underline underline-offset-4">
                        Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
