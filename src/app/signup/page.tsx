'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, Mail, Lock, ArrowRight, UtensilsCrossed, Eye, EyeOff } from 'lucide-react';

import { useState } from 'react';
import { useSignupMutation } from '@/redux/apiSlice';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [signup, { isLoading, isSuccess, isError, error }] = useSignupMutation();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signup(formData).unwrap();
        } catch (err) {
            console.error('Failed to sign up:', err);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
                <div className="glass p-10 rounded-[3rem] text-center max-w-sm">
                    <UtensilsCrossed size={48} className="mx-auto mb-6 text-secondary" />
                    <h2 className="text-2xl font-bold mb-4">Welcome to the Family!</h2>
                    <p className="opacity-70 mb-8">Registration successful! Please wait for admin approval to log in.</p>
                    <button onClick={() => router.push('/login')} className="btn-primary w-full">Go to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
            {/* Background Decorative Elements */}
            <div
                className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-[0.15]"
                style={{ backgroundColor: 'var(--color-secondary)', filter: 'blur(80px)' }}
            />
            <div
                className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-[0.1]"
                style={{ backgroundColor: 'var(--color-primary)', filter: 'blur(60px)' }}
            />

            <div className="glass w-full max-w-md p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <UtensilsCrossed size={32} style={{ color: 'var(--color-secondary)' }} />
                        <span className="text-2xl font-bold tracking-tight">
                            Tea<span className="text-secondary">Spark</span>
                        </span>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                    <p className="opacity-60">Join our community of bread lovers</p>
                </div>

                {isError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6 text-sm text-center font-medium">
                        {(error as any)?.data?.message || 'Something went wrong. Please try again.'}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-sm font-semibold mb-2 ml-1 opacity-70">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 group-focus-within:text-secondary transition-all" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter your name"
                                    className="w-full bg-white/40 dark:bg-black/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all font-medium dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-semibold mb-2 ml-1 opacity-70">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 group-focus-within:text-secondary transition-all" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Enter your email"
                                    className="w-full bg-white/40 dark:bg-black/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all font-medium dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-semibold mb-2 ml-1 opacity-70">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 group-focus-within:text-secondary transition-all" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Create a password"
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

                    <button
                        disabled={isLoading}
                        className="btn-primary w-full flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 text-center text-sm opacity-70">
                    Already have an account?{' '}
                    <Link href="/login" className="font-bold text-secondary hover:underline underline-offset-4">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
