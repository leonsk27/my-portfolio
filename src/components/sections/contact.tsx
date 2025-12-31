// src/components/sections/Contact.tsx
'use client';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaLinkedin, FaEnvelope } from 'react-icons/fa'; // Asegúrate de instalar react-icons
import { useLanguage } from '@/context/language_context';
export default function Contact() {
  const { t } = useLanguage();
  return (
    <section className="py-20 px-4 flex flex-col items-center justify-center bg-gradient-to-t from-black to-transparent">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-white mb-8">{t.contact.title}</h2>
        <p className="text-gray-200 mb-10 max-w-lg mx-auto">
          {t.contact.sub}
        </p>

        <div className="flex gap-8 justify-center">
          <SocialLink href="https://wa.link/at3w9s" icon={<FaWhatsapp size={30} />} label="WhatsApp" />
          <SocialLink href="https://www.linkedin.com/in/carlos-ojeda-vargas-67183034b/?locale=en-US" icon={<FaLinkedin size={30} />} label="LinkedIn" />
          <SocialLink href="mailto:creative.devs.001@gmail.com" icon={<FaEnvelope size={30} />} label="Email" />
        </div>
      </motion.div>
    </section>
  );
}

// Subcomponente local para limpiar el código principal
const SocialLink = ({ href, icon, label }: { href: string; icon: any; label: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors group"
  >
    <div className="p-4 bg-white/5 rounded-full group-hover:bg-white/10 group-hover:scale-110 transition-all border border-white/10">
      {icon}
    </div>
    <span className="text-sm font-medium">{label}</span>
  </a>
);