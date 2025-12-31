import { db } from '@/config/firebase'; // Asumiendo que tienes esto configurado
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { IProject } from '@/types/project';

// Principio de Inversión de Dependencias: La UI no llama a firebase, llama a getProjects
export const getProjects = async (): Promise<IProject[]> => {
  try {
    const q = query(collection(db, 'jobs'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as IProject));
  } catch (error) {
    console.error("Error obteniendo proyectos:", error);
    return []; // O lanzar error, según prefieras
  }
};