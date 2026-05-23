'use client';

import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import {
    Package,
    Layers,
    Settings,
    ArrowRight,
    Star,
    Clock,
    CheckCircle2,
    UtensilsCrossed
} from 'lucide-react';
import Link from 'next/link';

const responsibilityMeta: Record<string, { title: string, desc: string, icon: any, color: string, href: string }> = {
    manage_products: {
        title: 'Product Management',
        desc: 'Update treat catalog, prices, and stock status.',
        icon: Package,
        color: 'from-blue-500 to-indigo-600',
        href: '/staff/dashboard/products'
    },
    manage_categories: {
        title: 'Category Management',
        desc: 'Organize treats into delicious collections.',
        icon: Layers,
        color: 'from-emerald-500 to-teal-600',
        href: '/staff/dashboard/categories'
    }
};

const formatKey = (key: string) => key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

export default function StaffDashboard() {
    const { email, responsibilities } = useSelector((state: RootState) => state.auth);
    const activeResp = (responsibilities || []).map(key => responsibilityMeta[key] || {
        title: formatKey(key),
        desc: 'Access your assigned tasks and tools.',
        icon: Settings,
        color: 'from-slate-500 to-slate-700',
        href: '#'
    });

    return (
        <div className="space-y-10">
            {/* Welcome Section */}
            <div className="relative p-10 rounded-[3rem] bg-gradient-to-br from-secondary/10 to-accent/10 border border-white/50 dark:border-slate-800 overflow-hidden shadow-xl shadow-secondary/5">
                <div className="relative z-10">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl font-black mb-2 dark:text-white"
                    >
                        Welcome back, <span className="text-secondary">{email?.split('@')[0]}</span>! 👋
                    </motion.h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Here's what's on your plate for today.</p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Package size={120} strokeWidth={1} />
                </div>
            </div>

            {/* Responsibility Hub */}
            <div>
                <div className="flex items-center justify-between mb-8 px-2">
                    <h2 className="text-2xl font-bold dark:text-white">Your Responsibility Hub</h2>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{activeResp.length} Active Modules</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeResp.map((resp, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link
                                href={resp.href}
                                className="group relative block p-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-secondary/10 transition-all hover:-translate-y-2"
                            >
                                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${resp.color} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                                    <resp.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 dark:text-white group-hover:text-secondary transition-colors">{resp.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">{resp.desc}</p>

                                <div className="flex items-center text-secondary font-bold text-sm">
                                    Explore Module
                                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}

                    {activeResp.length === 0 && (
                        <div className="col-span-full py-20 text-center glass rounded-[3rem] border-dashed border-2 border-slate-200 dark:border-slate-800">
                            <Clock size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold text-slate-400">Awaiting Responsibilities</h3>
                            <p className="text-sm text-slate-500">Contact your administrator to assign roles.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats / Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
                        <Star size={20} className="text-amber-400 fill-amber-400" />
                        Staff Achievement
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center"><CheckCircle2 size={20} /></div>
                            <div>
                                <p className="text-sm font-bold dark:text-white">Profile Verified</p>
                                <p className="text-xs text-slate-500">Your account is approved and ready.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 rounded-lg bg-secondary text-white shadow-xl shadow-secondary/20 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                        <p className="text-sm opacity-80 mb-6">If you have questions about your roles, reach out to the admin.</p>
                        <button className="px-6 py-3 bg-white text-secondary font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors shadow-lg">Contact Support</button>
                    </div>
                    <UtensilsCrossed size={120} className="absolute -bottom-8 -right-8 opacity-10 rotate-12" />
                </div>
            </div>
        </div>
    );
}
