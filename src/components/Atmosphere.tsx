import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Vignette,
} from '@react-three/postprocessing';
import * as THREE from 'three';
import { lightSources } from '../data/mapData';
import { gridTo3D, GROUND_SIZE } from '../engine/gridUtils';

function pseudoRandom(seed: number) {
  const n = Math.sin(seed * 127.1) * 43758.5453;
  return n - Math.floor(n);
}

function LighthouseBeacon() {
  const [x, , z] = gridTo3D(12.5, 12.5);
  const fillOffset = 1.8;

  return (
    <group>
      {/* Main beacon */}
      <pointLight
        position={[x, 6.8, z]}
        color="#F0E2AE"
        intensity={12}
        decay={2}
      />
      {/* Cross-fill lights for even spread around the lighthouse */}
      <pointLight position={[x + fillOffset, 4.2, z]} color="#DCCB9A" intensity={4} decay={2} />
      <pointLight position={[x - fillOffset, 4.2, z]} color="#DCCB9A" intensity={4} decay={2} />
      <pointLight position={[x, 4.2, z + fillOffset]} color="#DCCB9A" intensity={4} decay={2} />
    </group>
  );
}

/** Animated point light with flicker */
function FlickerLight({ col, row, color, intensity }: { col: number; row: number; color: string; intensity: number }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const [x, , z] = gridTo3D(col, row);
  const phase = useMemo(() => pseudoRandom(col * 100 + row) * Math.PI * 2, [col, row]);
  const baseIntensity = useMemo(() => intensity * 16, [intensity]);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      const t = clock.getElapsedTime();
      const flicker = Math.sin(t * 3 + phase) * 0.15 + Math.sin(t * 7.3 + phase * 2) * 0.08;
      lightRef.current.intensity = baseIntensity + flicker * 5;
    }
  });

  const isLarge = intensity > 0.8;

  return (
    <pointLight
      ref={lightRef}
      position={[x, isLarge ? 6 : 1.5, z]}
      color={color}
      intensity={baseIntensity}
      decay={2}
    />
  );
}

/** Ash particles falling across the scene */
function AshParticles() {
  const count = 70;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const seed = i + 1;
      arr[i * 3] = (pseudoRandom(seed * 3) - 0.5) * GROUND_SIZE;
      arr[i * 3 + 1] = pseudoRandom(seed * 5) * 15;
      arr[i * 3 + 2] = (pseudoRandom(seed * 7) - 0.5) * GROUND_SIZE;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    const posArray = (ref.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    const elapsed = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      posArray[i * 3] += Math.sin(elapsed + i) * 0.003;
      posArray[i * 3 + 1] -= delta * 0.5;
      posArray[i * 3 + 2] += Math.cos(elapsed + i * 0.7) * 0.002;

      if (posArray[i * 3 + 1] < 0) {
        const seed = i + Math.floor(elapsed * 10) + 1;
        posArray[i * 3] = (pseudoRandom(seed * 11) - 0.5) * GROUND_SIZE;
        posArray[i * 3 + 1] = 12 + pseudoRandom(seed * 13) * 5;
        posArray[i * 3 + 2] = (pseudoRandom(seed * 17) - 0.5) * GROUND_SIZE;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#B0A898"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

export default function Atmosphere() {
  const sparklesSources = useMemo(() => lightSources.slice(0, 3), []);

  return (
    <>
      {/* Hemisphere light — warm sky / cool ground for subtle fill */}
      <hemisphereLight
        args={['#C8A882', '#2A2520', 0.22]}
        position={[0, 20, 0]}
      />

      {/* Ambient light — low for moodier feel */}
      <ambientLight intensity={0.3} color="#888899" />

      {/* Directional light — warm key light, restrained */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.32}
        color="#F0D890"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-camera-far={45}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
      />

      {/* Secondary directional — faint cool fill */}
      <directionalLight
        position={[-8, 10, -6]}
        intensity={0.1}
        color="#7788AA"
      />

      <LighthouseBeacon />

      {/* Point lights from lightSources data */}
      {lightSources.map((ls, i) => (
        <FlickerLight key={i} col={ls.col} row={ls.row} color={ls.color} intensity={ls.intensity} />
      ))}

      {/* Ember sparkles near light sources */}
      {sparklesSources.map((ls, i) => {
        const [x, , z] = gridTo3D(ls.col, ls.row);
        return (
          <Sparkles
            key={`spark-${i}`}
            position={[x, 1, z]}
            count={4}
            scale={2.5}
            size={1}
            speed={0.2}
            color={ls.color}
          />
        );
      })}

      {/* Ash particles */}
      <AshParticles />

      {/* Fog — tighter for moodier darkness at edges */}
      <fog attach="fog" args={['#000000', 24, 52]} />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.2}
          intensity={0.32}
          mipmapBlur
        />
        <Vignette
          eskil={false}
          offset={0.22}
          darkness={0.92}
        />
      </EffectComposer>
    </>
  );
}
