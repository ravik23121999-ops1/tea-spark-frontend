'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: "Sarah Jenkins",
    text: "The sourdough here is life-changing. I drive 20 miles every Saturday just to stock up for the week!",
    rating: 5,
    role: "Local Foodie"
  },
  {
    name: "Marco Rossi",
    text: "Truly artisanal. The croissants remind me of a small bakery I visited in Paris. Perfection.",
    rating: 5,
    role: "Chef de Cuisine"
  },
  {
    name: "Emily Chen",
    text: "Best muffins in the city! Not too sweet, just perfect texture and flavor. My kids love them.",
    rating: 5,
    role: "Busy Mom"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-padding overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6"
          >
            <Star size={16} className="text-accent" style={{ fill: 'var(--color-accent)' }} />
            <span className="text-sm font-bold">Trusted by 500+ happy neighbors</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6">
            What We <span className="text-secondary">Bake</span> People Love
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass p-6 md:p-8 rounded-3xl md:rounded-[3rem] relative"
            >
              <Quote size={40} className="absolute top-6 right-6 opacity-10 text-secondary" />
              <div className="flex gap-1 mb-4 md:mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-accent" style={{ fill: 'var(--color-accent)' }} />
                ))}
              </div>
              <p className="text-base md:text-lg italic mb-6 md:mb-8 opacity-80 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
              <div>
                <h4 className="font-bold text-lg md:text-xl">{review.name}</h4>
                <p className="text-sm opacity-50">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
