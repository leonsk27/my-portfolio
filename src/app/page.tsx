// src/app/page.tsx
// 'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import About from '@/components/sections/about';
import Skills from '@/components/sections/skills';
import Projects from '@/components/sections/projects';
import Contact from '@/components/sections/contact';
import Navbar from '@/components/ui/navbar';
import StarsCanvas from '@/components/canvas/star_bg';
import { getProjects } from '@/services/project.service';

export default async function Home() {
  const projects = await getProjects();
  return (
    <main className="relative w-full bg-black" id='home'>
      <Navbar/>
      {/* CAPA 1: El fondo exacto del ejemplo */}
      <StarsCanvas />
      {/* CAPA 2: Contenido Scrolleable */}
      <div className="relative z-10">
        <div id="about"><About /></div>
        <div id="skills"><Skills /></div>
        <div id="projects"><Projects projects={projects}/></div>
        <div id="contact"><Contact /></div>
        
        {/* Footer simple */}
        <footer className="w-full text-center py-4 text-white/20 text-sm">
          © {new Date().getFullYear()} Carlos Portfolio. Built with Next.js & R3F.
        </footer>
      </div>
    </main>
  );
}