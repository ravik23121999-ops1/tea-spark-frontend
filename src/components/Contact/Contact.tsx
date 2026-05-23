'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Camera, Globe } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="glass p-6 md:p-12 lg:p-16 rounded-3xl md:rounded-[4rem] overflow-hidden relative shadow-2xl">
          {/* Background Glow */}
          <div
            className="absolute top-0 right-0 w-72 md:w-96 h-72 md:h-96 pointer-events-none rounded-full"
            style={{ backgroundColor: 'rgba(183,148,244,0.08)', filter: 'blur(100px)' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 relative z-10">
            {/* Contact Info */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 md:mb-8"
              >
                Visit Our <span className="text-secondary">Bakery</span>
              </motion.h2>

              <div className="flex flex-col gap-6 md:gap-8">
                <div className="flex gap-4 md:gap-6 items-center">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl glass text-secondary shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Locate Us</h4>
                    <p className="opacity-70 text-sm md:text-base">123 Bakery Lane, Sweetwater, NY 10001</p>
                  </div>
                </div>

                <div className="flex gap-4 md:gap-6 items-center">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl glass text-secondary shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Call Us</h4>
                    <p className="opacity-70 text-sm md:text-base">+1 (555) 762-9253</p>
                  </div>
                </div>

                <div className="flex gap-4 md:gap-6 items-center">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl glass text-secondary shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Email Us</h4>
                    <p className="opacity-70 text-sm md:text-base">hello@teaspark.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 md:mt-12">
                <h4 className="font-bold mb-4 md:mb-6">Follow Our Journey</h4>
                <div className="flex gap-4">
                  <motion.div whileHover={{ y: -5 }} className="w-12 h-12 glass rounded-full flex items-center justify-center cursor-pointer text-secondary">
                    <Camera size={20} />
                  </motion.div>
                  <motion.div whileHover={{ y: -5 }} className="w-12 h-12 glass rounded-full flex items-center justify-center cursor-pointer text-secondary">
                    <Globe size={20} />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Baking Hours */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass p-6 md:p-8 rounded-3xl"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <Clock size={28} className="text-secondary" />
                <h3 className="text-xl md:text-2xl font-bold">Baking Hours</h3>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center pb-4" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <span className="font-medium text-sm md:text-base">Tuesday — Friday</span>
                  <span className="opacity-70 text-sm md:text-base">7 AM — 4 PM</span>
                </div>
                <div className="flex justify-between items-center pb-4" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <span className="font-medium text-sm md:text-base">Saturday</span>
                  <span className="opacity-70 text-sm md:text-base">8 AM — 5 PM</span>
                </div>
                <div className="flex justify-between items-center pb-4" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <span className="font-medium text-sm md:text-base">Sunday</span>
                  <span className="opacity-70 text-sm md:text-base">8 AM — 3 PM</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-accent">Monday</span>
                  <span className="text-accent font-bold text-sm md:text-base">Closed</span>
                </div>
              </div>

              <button className="w-full btn-primary mt-8 md:mt-12">
                Get Directions
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
