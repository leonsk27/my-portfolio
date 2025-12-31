'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useLanguage } from '@/context/language_context';
import { FaGithub, FaLinkedin, FaEnvelope, FaBars, FaTimes, FaWhatsapp } from 'react-icons/fa';


export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false); // Cerrar menú al hacer clic en móvil
    }
  };

  // Datos de redes sociales para iterar fácilmente
  const socialLinks = [
    { name: 'Whatsapp', icon: <FaWhatsapp />, url: 'https://wa.link/at3w9s' },
    { name: 'GitHub', icon: <FaGithub />, url: 'https://github.com/leonsk27' },
    { name: 'LinkedIn', icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/carlos-ojeda-vargas-67183034b/?locale=en-US' },
    { name: 'Email', icon: <FaEnvelope />, url: 'mailto:creative.devs.001@gmail.com' },
  ];

  // Variantes de animación para el menú móvil
  const mobileMenuVariants: Variants = {
    closed: { opacity: 0, x: "100%" },
    open: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-black/40 backdrop-blur-lg border-b border-white/10"
      >
        {/* --- LOGO --- */}
        <div className="text-xl font-bold text-white tracking-wider cursor-pointer z-50" onClick={() => scrollToSection('home')}>
          CARLOS<span className="text-blue-500">.DEV</span>
        </div>

        {/* --- DESKTOP MENU (Hidden on Mobile) --- */}
        <div className="hidden md:flex items-center gap-8">
          {/* Enlaces de navegación */}
          <div className="flex gap-6">
            {['about', 'skills', 'projects', 'contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-gray-300 hover:text-blue-400 transition-colors text-sm uppercase tracking-widest font-medium"
              >
                {t.nav[item]}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-white/20"></div> {/* Separador vertical */}

          {/* Redes Sociales */}
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white hover:scale-110 transition-all text-lg"
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>

          <div className="w-px h-6 bg-white/20"></div> {/* Separador vertical */}

          {/* Selector de Idioma */}
          <div className="flex gap-2 text-xs font-bold">
            {['es', 'en', 'pt'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang as any)}
                className={`px-2 py-1 rounded transition-all uppercase border border-transparent ${
                  language === lang 
                    ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]' 
                    : 'text-gray-500 hover:text-white hover:border-white/30'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* --- MOBILE HAMBURGER BUTTON (Visible only on Mobile) --- */}
        <button 
          className="md:hidden text-white text-2xl z-50 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

      </motion.nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center gap-8 md:hidden"
          >
            {/* Links Móviles */}
            <div className="flex flex-col items-center gap-6">
              {['about', 'skills', 'projects', 'contact'].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-2xl text-gray-300 hover:text-blue-500 font-bold uppercase tracking-widest transition-colors"
                >
                  {t.nav[item]}
                </button>
              ))}
            </div>

            <div className="w-16 h-px bg-white/20 my-4"></div>

            {/* Redes Sociales Móviles */}
            <div className="flex gap-8">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-3xl"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Selector de Idioma Móvil */}
            <div className="flex gap-4 mt-4">
              {['es', 'en', 'pt'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang as any)}
                  className={`px-4 py-2 rounded-full text-sm font-bold uppercase border ${
                    language === lang 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-white/20 text-gray-400'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}