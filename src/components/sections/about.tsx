// src/components/sections/About.tsx
'use client';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/language_context';

export default function About() {
  const { t } = useLanguage();
  return (
    <section className="min-h-screen flex items-center justify-center px-4 md:px-20">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl bg-white/5 backdrop-blur-lg border border-white/10 p-8 md:p-12 rounded-2xl shadow-xl"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {t.about.title} <span className="text-blue-300">Carlos Ojeda!</span>
        </h2>
        <p className="text-gray-200 text-lg md:text-xl leading-relaxed">
          {t.about.role}
        </p>
        <div className="mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-blue-500/50">
            {t.about.btn}
          </button>
        </div>
      </motion.div>
    </section>
  );
}