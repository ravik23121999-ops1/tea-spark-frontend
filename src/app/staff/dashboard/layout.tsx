'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Users,
    ShoppingCart,
    Layers,
    LayoutDashboard,
    LogOut,
    UtensilsCrossed,
    ChevronRight,
    Bell,
    Menu,
    X,
    Package,
    User
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/authSlice';
import type { RootState } from '@/redux/store';
import LogoutModal from '@/components/Common/LogoutModal';
import ThemeToggle from '@/components/Admin/ThemeToggle';

const allMenuIcons: Record<string, any> = {
    overview: LayoutDashboard,
    manage_products: Package,
    manage_categories: Layers,
};

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const responsibilities = useSelector((state: RootState) => state.auth.responsibilities) || [];
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleConfirmLogout = () => {
        dispatch(logout());
        router.push('/login');
        setIsLogoutModalOpen(false);
    };

    const menuItems = [
        { name: 'Overview', icon: LayoutDashboard, href: '/staff/dashboard' },
        ...(responsibilities.includes('manage_products') ? [{ name: 'Products', icon: Package, href: '/staff/dashboard/products' }] : []),
        ...(responsibilities.includes('manage_categories') ? [{ name: 'Categories', icon: Layers, href: '/staff/dashboard/categories' }] : []),
        { name: 'Profile', icon: User, href: '/staff/dashboard/profile' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col z-20 fixed top-0 left-0 h-screen overflow-y-auto scrollbar-hide">
                <div className="p-8">
                    <Link href="/" className="flex items-center gap-3">
                        <UtensilsCrossed size={32} className="text-secondary" />
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight dark:text-white">
                                Tea<span className="text-secondary">Spark</span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Staff Hub</span>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center justify-between px-4 py-3.5 rounded-lg transition-all group ${isActive
                                    ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-secondary transition-colors'} />
                                    <span className="font-semibold text-sm">{item.name}</span>
                                </div>
                                {isActive && <ChevronRight size={16} />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all font-semibold text-sm"
                    >
                        <LogOut size={20} />
                        Logout Session
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[60] lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.aside
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            className="absolute top-0 left-0 w-72 h-full bg-white dark:bg-slate-900 flex flex-col shadow-2xl"
                        >
                            <div className="p-8 flex items-center justify-between">
                                <Link href="/" className="flex items-center gap-3">
                                    <UtensilsCrossed size={32} className="text-secondary" />
                                    <span className="text-xl font-bold dark:text-white">Tea<span className="text-secondary">Spark</span></span>
                                </Link>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>
                            <nav className="flex-1 px-4 py-4 space-y-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all ${pathname === item.href ? 'bg-secondary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                    >
                                        <item.icon size={20} />
                                        <span className="font-semibold text-sm">{item.name}</span>
                                    </Link>
                                ))}
                            </nav>
                            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => { setIsMobileMenuOpen(false); setIsLogoutModalOpen(true); }}
                                    className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all font-semibold text-sm"
                                >
                                    <LogOut size={20} />
                                    Logout Session
                                </button>
                            </div>
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 lg:pl-72">
                {/* Header */}
                <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-[50]">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-secondary"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg font-bold dark:text-white">
                            {menuItems.find(i => i.href === pathname)?.name || 'Staff Hub'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <ThemeToggle />
                        <button className="hidden sm:flex p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-secondary transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />
                        </button>
                        <div className="h-10 w-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold">
                            S
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleConfirmLogout}
            />
        </div>
    );
}
