'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import WavyDivider from '../WavyDivider/WavyDivider';
import { Coffee, Croissant } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const HERO_CONTENT = [
  {
    highlight: 'Love',
    title: 'Baked with ',
    afterTitle: ', Served with Joy.',
    description: 'Discover the secret of morning magic through our artisanal pastries and handcrafted breads.',
    image: '/images/hero_plate.png',
    accentColor: 'var(--color-secondary)',
    bgColor: 'rgba(190, 227, 248, 1)',
    darkBgColor: 'rgba(26, 32, 44, 1)'
  },
  {
    highlight: 'Passion',
    title: 'Crafted with ',
    afterTitle: ', Purely Authentic.',
    description: 'Experience the crunch and complex flavors of our long-fermentation sourdough breads.',
    image: '/images/sourdough.png',
    accentColor: '#F6AD55',
    bgColor: 'rgba(254, 235, 200, 1)',
    darkBgColor: 'rgba(45, 55, 72, 1)'
  },
  {
    highlight: 'Joy',
    title: 'Infused with ',
    afterTitle: ', Your Daily Ritual.',
    description: 'Sweeten your day with our signature muffins and delicate pastries made fresh every dawn.',
    image: '/images/muffin.png',
    accentColor: 'var(--color-accent)',
    bgColor: 'rgba(251, 211, 141, 0.6)',
    darkBgColor: 'rgba(23, 25, 35, 1)'
  }
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const { theme } = useTheme();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_CONTENT.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }, [mouseX, mouseY]);

  const current = HERO_CONTENT[index];
  const activeBg = theme === 'light' ? current.bgColor : current.darkBgColor;

  return (
    <motion.section
      id="home"
      onMouseMove={handleMouseMove}
      animate={{ backgroundColor: activeBg }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="relative pt-16 md:pt-20 overflow-hidden"
    >
      {/* Interactive Mouse Glow */}
      <motion.div
        className="absolute pointer-events-none hidden md:block"
        style={{
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${current.accentColor} 0%, transparent 70%)`,
          opacity: 0.15,
          left: springX,
          top: springY,
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
          filter: 'blur(80px)'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center min-h-[80vh]">
        {/* Text Side */}
        <div className="order-2 md:order-1 text-center md:text-left pb-8 md:pb-0">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block rounded-full glass px-5 py-2 font-semibold text-sm mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            ESTABLISHED 2024
          </motion.span>

          <div className="min-h-[10rem] md:min-h-[16rem] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
              >
                {current.title}
                <span style={{ color: current.accentColor }}>{current.highlight}</span>
                {current.afterTitle}
              </motion.h1>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg md:text-xl mb-10 max-w-lg mx-auto md:mx-0"
              style={{ color: 'var(--color-text-light)' }}
            >
              {current.description}
            </motion.p>
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="btn-primary">Order Now</button>
            <button className="btn-outline px-8 py-3">View Menu</button>
          </div>
        </div>

        {/* Image Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative flex justify-center items-center order-1 md:order-2"
        >
          {/* Rotating Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute rounded-full"
            style={{
              width: 'min(85vw, 540px)',
              height: 'min(85vw, 540px)',
              border: '2px dashed rgba(255, 255, 255, 0.4)',
              zIndex: 5
            }}
          />

          {/* Main Circular Image */}
          <div
            className="relative z-20 rounded-full overflow-hidden shadow-2xl"
            style={{
              width: 'min(75vw, 480px)',
              height: 'min(75vw, 480px)',
              background: 'white',
              border: '10px solid rgba(255, 255, 255, 0.6)',
              isolation: 'isolate'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full h-full relative rounded-full overflow-hidden"
              >
                <Image
                  src={current.image}
                  alt={current.highlight}
                  fill
                  className="object-cover rounded-full"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Floating Icons */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute glass float hidden sm:flex rounded-full p-4"
            style={{ top: '-10px', left: '20px', zIndex: 30 }}
          >
            <Croissant size={28} className="text-secondary" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute glass hidden sm:flex rounded-full p-4"
            style={{ bottom: '40px', right: '0', zIndex: 30 }}
          >
            <Coffee size={28} className="text-accent" />
          </motion.div>

          {/* Background Glow */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute rounded-full"
            style={{
              zIndex: 1,
              width: 'min(90vw, 24rem)',
              height: 'min(90vw, 24rem)',
              backgroundColor: current.accentColor,
              filter: 'blur(80px)'
            }}
          />
        </motion.div>
      </div>

      <div className="mt-8 md:mt-20">
        <WavyDivider color="var(--color-bg)" position="bottom" />
      </div>
    </motion.section>
  );
}
