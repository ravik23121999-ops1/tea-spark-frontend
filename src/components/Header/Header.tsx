'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, Menu, UtensilsCrossed, Sun, Moon, X, QrCode } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/authSlice';
import { getCart } from '@/redux/cartSlice';
import { useState, useEffect } from 'react';
import LogoutModal from '@/components/Common/LogoutModal';

const NAV_LINKS = [
  { name: 'Our Story', href: '#about' },
  { name: 'Process', href: '#process' },
  { name: 'Menu', href: '#products' },
  { name: 'Contact', href: '#contact' },
  { name: 'QR Scanner', href: '/qr-scanner' }
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { token, adminToken, role } = useSelector((state: RootState) => state.auth);
  const { cart } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(getCart() as any);
  }, [dispatch]);

  const isLoggedIn = !!token || !!adminToken;

  const handleConfirmLogout = () => {
    dispatch(logout());
    setIsLogoutModalOpen(false);
    router.push('/');
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass sticky top-0 z-50 w-full flex justify-between items-center h-20 px-4 md:px-8"
        style={{ borderBottom: '1px solid var(--glass-border)' }}
      >
        <motion.div 
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img src="/tea-spark-logo.svg" alt="Tea Spark Logo" width={28} height={28} style={{ color: 'var(--color-secondary)' }} />
          <span className="text-xl md:text-2xl font-bold tracking-tight">
            Tea<span className="text-secondary">Spark</span>
          </span>
        </motion.div>

        <nav className="hidden md:flex gap-8 h-full items-center font-medium">
          {NAV_LINKS.map((link) => (
            <a key={link.name} href={link.href} className="hover-link h-full flex items-center">
              {link.name}
            </a>
          ))}
          {/* Dashboard Link for Admin/Staff */}
          {isLoggedIn && (
            <Link
              href={adminToken ? '/admin/dashboard' : '/staff/dashboard'}
              className="text-secondary font-bold hover:underline decoration-2 underline-offset-4"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            className="rounded-full glass overflow-hidden relative shrink-0"
            style={{
              width: '42px',
              height: '42px',
              boxShadow: 'var(--shadow-soft)'
            }}
          >
            <motion.div
              initial={false}
              animate={{ y: theme === 'light' ? 0 : -42 }}
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
              className="flex flex-col"
              style={{ width: '100%' }}
            >
              <div className="flex items-center justify-center" style={{ height: '42px' }}>
                <Sun size={20} strokeWidth={2.5} className="text-accent" />
              </div>
              <div className="flex items-center justify-center" style={{ height: '42px' }}>
                <Moon size={20} strokeWidth={2.5} className="text-secondary" />
              </div>
            </motion.div>
          </motion.button>

          <Link 
            href="/cart"
            className="relative flex items-center cursor-pointer shrink-0 hover:opacity-80 transition-opacity"
          >
            <ShoppingBag size={24} />
            {cart && cart.items.length > 0 && (
              <span className="absolute flex items-center justify-center rounded-full text-white text-xs font-bold"
                style={{
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: 'var(--color-secondary)',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.625rem'
                }}
              >
                {cart.items.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="hidden sm:inline-flex px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="hidden sm:inline-flex btn-primary px-6 py-2.5 text-sm">
              Login
            </Link>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center shrink-0"
          >
            <Menu size={28} />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 w-3/4 max-w-sm h-full bg-white dark:bg-slate-900 z-[70] p-8 shadow-2xl md:hidden border-l border-slate-100 dark:border-slate-800"
            >
              <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold dark:text-white">Tea<span className="text-secondary">Spark</span></span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="dark:text-white"><X size={28} /></button>
                </div>
                <nav className="flex flex-col gap-6 text-lg font-bold">
                  {NAV_LINKS.map(link => (
                    <a key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="dark:text-white hover:text-secondary transition-colors">{link.name}</a>
                  ))}
                  {isLoggedIn && (
                    <Link
                      href={adminToken ? '/admin/dashboard' : '/staff/dashboard'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-secondary"
                    >
                      Dashboard
                    </Link>
                  )}
                </nav>
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                  {isLoggedIn ? (
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); setIsLogoutModalOpen(true); }}
                      className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-4 btn-primary text-center"
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
