'use client';

import * as THREE from 'three';
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// --- MATERIAL PRINCIPAL (Anillo Eléctrico) ---
const BlackHoleRingMaterial = shaderMaterial(
  {
    uTime: 0,
    uIntensity: 2.0, // Intensidad ajustada
    uInnerFade: 1.6,
    uOuterFade: 1.2,
    uColorA: new THREE.Color('#006eff'), // Azul eléctrico vibrante
    uColorB: new THREE.Color('#001eff'), // Azul profundo
    uColorC: new THREE.Color('#000000'), // Negro
  },
  // vertex
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // fragment
  `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform float uIntensity;
  uniform float uInnerFade;
  uniform float uOuterFade;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  float hash(vec2 p){
    p = fract(p*vec2(123.34, 345.45));
    p += dot(p, p+34.345);
    return fract(p.x*p.y);
  }
  float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(a, b, u.x) + (c - a)*u.y*(1.0-u.x) + (d - b)*u.x*u.y;
  }

  void main() {
    float x = vUv.x;      
    float y = vUv.y;      

    float d = abs(y - 0.5) * 2.0;
    float core = smoothstep(1.0, 0.0, d);

    float innerGlow = pow(smoothstep(1.0, 0.0, d), uInnerFade);
    float outerGlow = pow(smoothstep(1.0, 0.0, d), uOuterFade);

    float sweep = fract(x + uTime * 0.18);
    float highlight = smoothstep(0.0, 0.06, sweep) * (1.0 - smoothstep(0.06, 0.22, sweep));
    highlight *= (1.0 - d); 

    float wave  = sin((x * 10.0) + uTime * 1.7) * 0.5 + 0.5;
    float n = noise(vec2(x * 18.0, uTime * 0.55));

    float pulse = sin(uTime * 1.15) * 0.12 + 0.92;

    vec3 col = mix(uColorA, uColorB, wave);
    col = mix(col, uColorC, pow(d, 1.35) * 0.7);

    // Borde brillante (Rim Light) - AHORA TEÑIDO DE AZUL para no tapar texto blanco
    float rim = pow(1.0 - d, 6.0);
    vec3 rimCol = vec3(0.4, 0.6, 1.0) * rim; // Azul claro en vez de blanco puro

    float alpha =
      (0.22 * core + 0.95 * innerGlow + 0.65 * outerGlow) *
      (0.80 + 0.35 * n) *
      pulse;

    // Highlight fuerte también teñido
    col += highlight * vec3(0.7, 0.2, 1.0) * 1.6;
    col += rimCol * 1.2;
    col *= uIntensity;

    gl_FragColor = vec4(col, alpha);
  }
  `
);

// --- MATERIAL DE FONDO (Rayos sutiles) ---
const OuterPatternMaterial = shaderMaterial(
  { uTime: 0, uOpacity: 0.12, uColor: new THREE.Color('#2b59ff') },
  // vertex
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // fragment
  `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float r = length(uv);
    float a = atan(uv.y, uv.x);

    // Rayos finos y orgánicos (no octágono)
    float radial = abs(sin(a * 30.0 + uTime * 0.5)); 
    radial = pow(radial, 3.0); 

    float rings = abs(sin((r * 20.0) - uTime * 0.2));
    rings = pow(rings, 5.0);

    float band = smoothstep(0.35, 0.55, r) * (1.0 - smoothstep(0.78, 0.92, r));

    float mask = band * (0.6 * radial + 0.4 * rings);

    gl_FragColor = vec4(uColor, mask * uOpacity);
  }
  `
);

// Textura de resplandor (Glow) ajustada a azul oscuro
function makeGlowTexture(size = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  // Colores del gradiente cambiados a azul puro
  g.addColorStop(0, 'rgba(40, 100, 255, 0.35)'); 
  g.addColorStop(0.35, 'rgba(0, 50, 200, 0.22)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

export default function BlackHoleRing() {
  const groupRef = useRef<THREE.Group>(null);

  // --- GEOMETRÍA REDUCIDA (Hacemos todo más pequeño) ---
  // Antes radio principal 1.0 -> Ahora 0.85
  const ringGeo = useMemo(() => new THREE.TorusGeometry(0.85, 0.13, 64, 320), []);
  const haloGeo = useMemo(() => new THREE.TorusGeometry(0.95, 0.06, 48, 320), []);
  const highlightGeo = useMemo(() => new THREE.TorusGeometry(0.86, 0.015, 24, 220), []);

  const matMain = useMemo(() => {
    const m = new (BlackHoleRingMaterial as any)();
    m.transparent = true;
    m.depthWrite = false;
    m.blending = THREE.AdditiveBlending;
    m.uIntensity = 1.8; // Menos intensidad para no quemar texto
    m.uInnerFade = 1.65;
    m.uOuterFade = 1.2;
    // Colores "Electric Blue"
    m.uColorA = new THREE.Color('#006eff');
    m.uColorB = new THREE.Color('#001eff');
    m.uColorC = new THREE.Color('#000005');
    return m;
  }, []);

  const matHalo = useMemo(() => {
    const m = new (BlackHoleRingMaterial as any)();
    m.transparent = true;
    m.depthWrite = false;
    m.blending = THREE.AdditiveBlending;
    m.uIntensity = 0.9;
    m.uInnerFade = 1.25;
    m.uOuterFade = 1.0;
    // Halo un poco más claro pero azul
    m.uColorA = new THREE.Color('#4D9FFF');
    m.uColorB = new THREE.Color('#0048FF');
    m.uColorC = new THREE.Color('#000000');
    return m;
  }, []);

  const patternMat = useMemo(() => {
    const m = new (OuterPatternMaterial as any)();
    m.transparent = true;
    m.depthWrite = false;
    m.blending = THREE.AdditiveBlending;
    m.uOpacity = 0.15;
    m.uColor = new THREE.Color('#0055ff');
    return m;
  }, []);

  const highlightMat = useMemo(() => {
    const m = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#66aaff'), // Highlight azulado, no blanco
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return m;
  }, []);

  const glowTex = useMemo(() => (typeof document !== 'undefined' ? makeGlowTexture(256) : null), []);

  useFrame((_, delta) => {
    matMain.uTime += delta;
    matHalo.uTime += delta;
    patternMat.uTime += delta;

    if (groupRef.current) {
      groupRef.current.rotation.z -= delta * 0.35;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.12, 0, 0]}>
      
      {/* 1. Fondo Circular (Reducido y suavizado) */}
      <mesh position={[0, 0, -0.08]}>
        {/* args reducidos proporcionalmente */}
        <ringGeometry args={[1.15, 1.40, 128]} /> 
        <meshBasicMaterial
          color="#0033aa"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Patrón de rayos */}
      <mesh position={[0, 0, -0.079]}>
        <ringGeometry args={[0, 1.9, 128]} />
        <primitive object={patternMat} attach="material" />
      </mesh>

      {/* 3. Glow Central (Reducido) */}
      {glowTex && (
        <sprite position={[0, 0, -0.1]} scale={[3.0, 3.0, 1]}> {/* Escala reducida de 3.6 a 3.0 */}
          <spriteMaterial
            map={glowTex}
            transparent
            opacity={0.50}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}

      {/* 4. Aro principal */}
      <mesh geometry={ringGeo}>
        <primitive object={matMain} attach="material" />
      </mesh>

      {/* 5. Halo exterior */}
      <mesh geometry={haloGeo}>
        <primitive object={matHalo} attach="material" />
      </mesh>

      {/* 6. Highlight extra */}
      <mesh geometry={highlightGeo} material={highlightMat} />

      {/* 7. Centro oscuro (Agujero Negro) */}
      <mesh position={[0, 0, 0.01]}>
        {/* Radio reducido de 0.78 a 0.65 para coincidir con la reducción general */}
        <circleGeometry args={[0.65, 80]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}