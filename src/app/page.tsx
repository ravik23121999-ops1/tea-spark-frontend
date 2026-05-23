'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Products from "@/components/Products/Products";
import QRScannerSection from "@/components/QRScanner/QRScannerSection";
import Testimonials from "@/components/Testimonials/Testimonials";
import Contact from "@/components/Contact/Contact";
import { Send, Mail, QrCode, Camera } from "lucide-react";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="relative">
      <motion.div className="scroll-progress" style={{ scaleX }} />

      <Header />

      <Hero />

      <Products />

      <QRScannerSection />

      <Testimonials />

      {/* Newsletter Section */}
      <section className="section-padding relative overflow-hidden" style={{ backgroundColor: 'var(--color-primary)' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute pointer-events-none"
          style={{ top: '-10%', right: '-5%', opacity: 0.05 }}
        >
          <Mail size={400} />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center relative z-10 py-8 md:py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-4 md:mb-6">
              Stay in the <span className="text-secondary">Loop</span>
            </h2>
            <p className="text-lg md:text-xl mb-8 md:mb-10 max-w-lg mx-auto opacity-80" style={{ color: 'var(--color-text)' }}>
              Get notified about our weekly specials, secret recipes, and artisanal baking tips.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="glass w-full py-4 px-6 rounded-full outline-none text-base"
                style={{
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.4)'
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 whitespace-nowrap"
              >
                <Send size={20} /> Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Contact />

      {/* Footer */}
      <footer className="py-12 md:py-16" style={{ backgroundColor: 'var(--color-white)', color: 'var(--color-text)', borderTop: '1px solid var(--glass-border)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <motion.div 
            className="flex items-center justify-center gap-2 mb-6 md:mb-8 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src="/tea-spark-logo.svg" alt="Tea Spark Logo" width={32} height={32} style={{ color: 'var(--color-secondary)' }} />
            <h3 className="text-2xl md:text-3xl font-bold">
              Tea<span className="text-secondary">Spark</span>
            </h3>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-6 md:mb-8">
            <a href="#about" className="footer-link">Our Story</a>
            <a href="#process" className="footer-link">Process</a>
            <a href="#products" className="footer-link">Menu</a>
            <a href="#contact" className="footer-link">Contact</a>
          </div>
          <p className="opacity-50 text-sm">
            &copy; 2024 Tea Spark Bakery. Handcrafted with Passion. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
