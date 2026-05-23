'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lock, Mail, LogIn, UtensilsCrossed, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAdminLoginMutation } from '@/redux/apiSlice';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setAdminCredentials } from '@/redux/authSlice';

export default function AdminLoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [login, { isLoading, isError, error }] = useAdminLoginMutation();
    const router = useRouter();
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await login(formData).unwrap();
            dispatch(setAdminCredentials({
                token: response.token,
                email: response.email,
                role: response.role
            }));
            router.push('/admin/dashboard');
        } catch (err) {
            console.error('Admin login failed:', err);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-950">
            {/* Dark Professional Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(2,6,23,1)_100%)]" />
                <motion.div
                    animate={{
                        opacity: [0.3, 0.5, 0.3],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-dark p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-2xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/20 mb-6">
                            <ShieldCheck size={32} className="text-secondary" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
                        <p className="text-slate-400">Secure access to Tea Spark management</p>
                    </div>

                    {isError && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6 text-sm text-center font-medium">
                            {(error as any)?.data?.message || 'Unauthorized access detected.'}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div className="group">
                                <label className="block text-sm font-semibold mb-2 ml-1 text-slate-300">Admin Email</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-secondary transition-all" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                                        placeholder="admin@teaspark.com"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-sm font-semibold mb-2 ml-1 text-slate-300">Security Key</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-secondary transition-all" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white outline-none focus:ring-2 focus:ring-secondary/50 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-secondary transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? 'Verifying...' : 'Authenticate'}
                            <LogIn size={20} />
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <Link href="/" className="text-slate-500 hover:text-secondary transition-colors inline-flex items-center gap-2">
                            ← Back to Bakery
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
