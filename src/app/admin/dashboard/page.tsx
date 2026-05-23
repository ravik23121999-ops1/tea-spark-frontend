'use client';

import { motion } from 'framer-motion';
import {
    Users,
    Package,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { useGetPendingStaffQuery, useGetProductsQuery, useGetOrdersQuery } from '@/redux/apiSlice';
import Link from 'next/link';

export default function AdminDashboardOverview() {
    const { data: pendingStaff } = useGetPendingStaffQuery();
    const { data: products } = useGetProductsQuery();
    const { data: ordersData } = useGetOrdersQuery({ page: 1, limit: 1 });

    const stats = [
        { name: 'Pending Approvals', value: pendingStaff?.length || 0, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { name: 'Total Orders', value: ordersData?.pagination?.totalItems || 0, icon: CheckCircle2, color: 'text-secondary', bg: 'bg-secondary/10', href: '/admin/dashboard/orders' },
        { name: 'Total Products', value: products?.length || 0, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Active Staff', value: '12', icon: Users, color: 'text-green-500', bg: 'bg-green-500/10' },
        { name: 'Weekly Growth', value: '+14%', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ];

    return (
        <div className="space-y-8">
            {/* Page Title */}
            <div>
                <h1 className="text-3xl font-bold dark:text-white mb-2">Welcome Back, Admin</h1>
                <p className="text-slate-500 dark:text-slate-400">Here's what's happening at Tea Spark today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Card = (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.name}</p>
                                <h3 className="text-2xl font-bold dark:text-white">{stat.value}</h3>
                            </div>
                        </div>
                    </motion.div>
                    );
                    return 'href' in stat && stat.href ? (
                        <Link key={stat.name} href={stat.href} className="block hover:opacity-90 transition-opacity">
                            {Card}
                        </Link>
                    ) : (
                        Card
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activities or Quick Actions */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2">
                        <AlertCircle size={20} className="text-secondary" />
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button className="p-4 rounded-lg bg-secondary/10 text-secondary font-bold hover:bg-secondary hover:text-white transition-all text-left">
                            Add New Product
                        </button>
                        <button className="p-4 rounded-lg bg-accent/10 text-accent font-bold hover:bg-accent hover:text-white transition-all text-left">
                            Create Category
                        </button>
                        <button className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-left">
                            View Reports
                        </button>
                        <button className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-left">
                            System Settings
                        </button>
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-green-500" />
                        System Health
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">API Server</span>
                            <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full">Operational</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Database (MongoDB)</span>
                            <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full">Operational</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Image Storage</span>
                            <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-xs font-bold rounded-full">High Latency</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
