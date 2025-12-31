// src/components/sections/Skills.tsx
'use client';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/language_context';

const skills = [
  "Flutter", "Next.js", "Angular", "Node.js", "Django", "FastAPI", 
  "Laravel", "Google Cloud", "Firestore", "AWS", "Hugging Face", 
  "TensorFlow", "PostgreSQL", "MariaDB", "MongoDB", "Postman", 
  "ClickUp", "GitHub"
];

export default function Skills() {
  const { t } = useLanguage();
  return (
    <section className="min-h-screen py-20 px-4 md:px-20 flex flex-col justify-center">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-white mb-12 text-center"
      >
        {t.skills.title}:<span className="text-purple-400"> {t.skills.sub}</span>
      </motion.h2>

      <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, type: "spring" }} // Efecto cascada
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }}
            className="bg-white/5 border border-white/10 backdrop-blur-md px-6 py-3 rounded-full text-gray-100 cursor-pointer hover:text-white transition-colors"
          >
            {skill}
          </motion.div>
        ))}
      </div>
    </section>
  );
}