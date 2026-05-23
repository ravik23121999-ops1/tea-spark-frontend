'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, LogIn, UtensilsCrossed, Eye, EyeOff } from 'lucide-react';

import { useState } from 'react';
import { useLoginMutation } from '@/redux/apiSlice';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setStaffCredentials } from '@/redux/authSlice';

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [login, { isLoading, isError, error }] = useLoginMutation();
    const router = useRouter();
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await login(formData).unwrap();
            dispatch(setStaffCredentials({
                token: response.token,
                email: response.email,
                role: response.role || 'staff',
                responsibilities: response.responsibilities || []
            }));
            router.push('/staff/dashboard');
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
            {/* Background Decorative Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, -45, 0],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-96 h-96 rounded-full"
                style={{ backgroundColor: 'var(--color-accent)', filter: 'blur(100px)' }}
            />
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 right-0 w-80 h-80 rounded-full"
                style={{ backgroundColor: 'var(--color-secondary)', filter: 'blur(80px)' }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="glass w-full max-w-md p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <UtensilsCrossed size={32} style={{ color: 'var(--color-secondary)' }} />
                        <span className="text-2xl font-bold tracking-tight">
                            Tea<span className="text-secondary">Spark</span>
                        </span>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
                    <p className="opacity-60">Log in to your account</p>
                </div>

                {isError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6 text-sm text-center font-medium">
                        {(error as any)?.data?.message || 'Invalid email or password.'}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div className="group">
                            <label className="block text-sm font-semibold mb-2 ml-1 opacity-70">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 group-focus-within:text-secondary transition-all" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="name@example.com"
                                    className="w-full bg-white/40 dark:bg-black/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all font-medium dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <div className="flex justify-between items-center mb-2 ml-1 px-1">
                                <label className="block text-sm font-semibold opacity-70">Password</label>
                                <Link href="/forgot-password" className="text-xs font-bold text-secondary hover:underline underline-offset-4">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 group-focus-within:text-secondary transition-all" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-white/40 dark:bg-black/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-12 outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all font-medium dark:text-white"
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
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        className="btn-primary w-full flex items-center justify-center gap-2 group mt-4 disabled:opacity-50"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                        <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </form>

                <div className="mt-10 text-center text-sm opacity-70 flex flex-col gap-2">
                    <div>
                        New to Tea Spark?{' '}
                        <Link href="/signup" className="font-bold text-secondary hover:underline underline-offset-4">
                            Sign Up
                        </Link>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                        Are you an admin?{' '}
                        <Link href="/admin-login" className="font-bold text-slate-400 hover:text-secondary hover:underline underline-offset-4">
                            Admin Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
