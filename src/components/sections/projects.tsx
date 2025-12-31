'use client';

import { useState } from 'react'; // 1. Importamos useState
import { IProject } from "@/types/project";
import { motion, AnimatePresence } from "framer-motion"; // 2. Importamos AnimatePresence

interface Props {
  projects: IProject[];
}

export default function ProjectGrid({ projects }: Props) {
  // --- ESTADO PARA EL LIGHTBOX ---
  // Almacena el ID del proyecto que se está expandiendo. Si es null, no hay nada expandido.
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // --- FUNCIÓN HELPER (La misma de antes) ---
  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;
    return path.startsWith('/') ? path : `/${path}`;
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        <p>No se encontraron proyectos aún.</p>
      </div>
    );
  }

  return (
    <>
      {/* --- GRILLA PRINCIPAL --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 max-w-7xl mx-auto relative z-10">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative bg-gray-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full shadow-lg"
          >
            {/* 3. CONTENEDOR DE IMAGEN (MINIATURA) 
                - Lo envolvemos en motion.div para usar layoutId.
                - Agregamos cursor-pointer y onClick.
            */}
            <motion.div 
                layoutId={`image-container-${project.id}`} // LA CLAVE DE LA ANIMACIÓN
                onClick={() => setSelectedId(project.id)}
                className="h-48 bg-gray-800 relative overflow-hidden shrink-0 cursor-pointer"
            >
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
               
               <img 
                  src={getImageUrl(project.image)} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
              />
            </motion.div>

            {/* Contenido de la tarjeta (igual que antes) */}
            <div className="p-6 flex flex-col flex-grow pointer-events-auto">
              <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
              <div className="h-18 overflow-y-auto scrollbar-thin pr-2 mb-4">
                  <p className="text-gray-400 text-sm leading-relaxed">
                      {project.subtitle}
                  </p>
              </div>
              <div className="mt-auto pt-4 border-t border-white/5">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech?.map((tech) => (
                      <span key={tech} className="text-xs font-medium text-blue-300 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors inline-block text-center w-full md:w-auto">
                          VER PROYECTO
                      </a>
                  )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 4. EL OVERLAY (LIGHTBOX) 
         AnimatePresence permite animar cuando el componente se desmonta (al cerrar).
      */}
{/* 4. EL OVERLAY (LIGHTBOX) DEFINITIVO
   - Respeta la proporción original de la imagen.
   - Se adapta si es vertical u horizontal.
*/}
<AnimatePresence>
  {selectedId && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedId(null)} 
      // Puse p-4 md:p-8 para dar un poco de margen contra el borde de la pantalla
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 md:p-8 cursor-zoom-out backdrop-blur-sm"
    >
      {projects.map(project => (
        project.id === selectedId && (
          // CONTENEDOR DE LA IMAGEN
          // w-auto h-auto: Se adapta al tamaño de la imagen.
          // max-w/max-h: Límites para que no se salga de la pantalla.
          <motion.div
            key={project.id}
            layoutId={`image-container-${project.id}`} 
            className="relative w-auto h-auto max-w-[80vw] max-h-[80vh] rounded-xl overflow-hidden shadow-2xl bg-gray-900 border border-white/10"
            onClick={(e) => e.stopPropagation()} 
          >
              {/* LA IMAGEN
                 - block: Elimina el espacio en blanco debajo de las imágenes en línea.
                 - w-auto h-auto: Usa las dimensiones reales de la foto.
                 - object-contain: Seguro de vida por si acaso, pero con w-auto/h-auto casi no hace falta.
                 - max-h-[90vh]: Importante para imágenes verticales muy largas.
              */}
              <img 
                  src={getImageUrl(project.image)} 
                  alt={project.title}
                  className="block w-auto h-auto max-h-[90vh] max-w-[90vw] object-contain"
              />

              {/* Botón de cerrar flotante (más limpio que una barra inferior) */}
              <button 
                  onClick={() => setSelectedId(null)}
                  className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors backdrop-blur-md"
                  aria-label="Cerrar"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
          </motion.div>
        )
      ))}
    </motion.div>
  )}
</AnimatePresence>
    </>
  );
}