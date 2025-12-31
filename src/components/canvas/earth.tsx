'use client'; // Importante: R3F necesita ejecutarse en el cliente

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const Earth = () => {
  // Referencia para manipular el objeto directamente
  const meshRef = useRef<THREE.Mesh>(null!);

  // useFrame se ejecuta 60 veces por segundo (bucle de animación)
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.2; // Rotar suavemente
  });

  return (
    <>
      {/* Luz ambiental para ver algo */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      
      {/* Fondo de Estrellas pre-fabricado por Drei */}
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Nuestro Planeta (Esfera simple por ahora) */}
      <mesh ref={meshRef} scale={2.5}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#4d4dff" wireframe={true} />
      </mesh>
    </>
  );
};

export default Earth;