'use client';

import React, { createContext, useContext, useState } from 'react';

// 1. Diccionario de traducciones
const translations = {
  es: {
    nav: { about: "Sobre Mí", skills: "Habilidades", projects: "Proyectos", contact: "Contacto" },
    about: {
      title: "Hola! Soy",
      role: "Soy ingeniero de software full stack con experiencia en desarrollo móvil, web e integración de inteligencia artificial. Descubre mis proyectos y habilidades.",
      btn: "Descubre mis proyectos ↓"
    },
    skills: { title: "Mis Habilidades", sub: "Desarrollo de software, Inteligencia artificial, Ciencia de Datos" },
    projects: { title: "Proyectos", sub: "Destacados" },
    contact: { title: "Hablemos", sub: "¿Tienes una idea innovadora u oferta interesante? Estoy listo para hacerla realidad!" }
  },
  en: {
    nav: { about: "About Me", skills: "Skills", projects: "Projects", contact: "Contact" },
    about: {
      title: "Hi! I'm",
      role: "I'm a full-stack software engineer with experience in mobile and web development, and AI integration. Discover my projects and skills.",
      btn: "Check out my work ↓"
    },
    skills: { title: "My Skills", sub: "Software development, Artificial intelligence, Data science" },
    projects: { title: "Featured", sub: "Projects" },
    contact: { title: "Let's Talk", sub: "Do you have an innovative idea or an interesting offer? I'm ready to make it a reality!" }
  },
  pt: {
    nav: { about: "Sobre Mim", skills: "Habilidades", projects: "Projetos", contact: "Contato" },
    about: {
      title: "Olá! Sou",
      role: "Sou um engenheiro de software full-stack com experiência em desenvolvimento mobile e web, além de integração de IA. Descubra meus projetos e habilidades.",
      btn: "Veja meus projetos ↓"
    },
    skills: { title: "Minhas Habilidades", sub: "Desenvolvimento de software, Inteligência artificial, Ciência de dados" },
    projects: { title: "Projetos em", sub: "Destaque" },
    contact: { title: "Vamos conversar", sub: "Você tem uma ideia inovadora ou uma proposta interessante? Estou pronto para torná-la realidade!" }
  }
};

// 2. Crear el Contexto
type Language = 'es' | 'en' | 'pt';
const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('es');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 3. Hook para usarlo fácilmente en cualquier componente
export const useLanguage = () => useContext(LanguageContext);