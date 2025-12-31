'use client';

import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Preload } from '@react-three/drei';
import { inSphere } from 'maath/random';
// IMPORTAMOS EL NUEVO COMPONENTE
import BlackHoleRing from './black_hole_ring';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const StarBackground = (props: any) => {
    const ref = useRef<any>(null);

    const [sphere] = useState(() => {
        const data = inSphere(new Float32Array(6000), { radius: 1.2 });
        for (let i = 0; i < data.length; i++) {
            if (isNaN(data[i])) data[i] = 0;
        }
        return data;
    });

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

const StarsCanvas = () => {
    return (
        <div className="w-full h-auto fixed inset-0 z-0 bg-black">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Suspense fallback={null}>

                    {/* Fondo de estrellas */}
                    <StarBackground />

                    {/* EL AGUJERO NEGRO EN EL CENTRO */}
                    {/* position: [0,0,0] = centro */}
                    {/* scale: 0.25 para ajustarlo al tamaño de pantalla móvil/desktop sin que sea gigante */}
                    <group position={[0, 0.12, 0]} scale={0.34}>
                        <BlackHoleRing />
                    </group>
                    <EffectComposer>
                        <Bloom intensity={0.6} luminanceThreshold={0.20} luminanceSmoothing={0.9} />
                    </EffectComposer>

                </Suspense>
                <Preload all />
            </Canvas>
        </div>
    );
};

export default StarsCanvas;