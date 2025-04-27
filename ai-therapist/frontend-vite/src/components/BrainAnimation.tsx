import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  MeshDistortMaterial,
  Sphere,
} from '@react-three/drei';
import { motion } from 'framer-motion';
import styled from 'styled-components';

// Styled component for the canvas container
const CanvasContainer = styled.div`
  height: 500px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

// Brain model or fallback sphere if model can't be loaded
const Brain = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animate rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  // Try to use a brain model, but fall back to a sphere with interesting material
  return (
    <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color='#3a3a7e'
        attach='material'
        distort={0.4}
        speed={2}
        roughness={0.2}
      />
    </Sphere>
  );
};

// Animated particles around the brain
const Particles = () => {
  const particles = Array.from({ length: 100 }).map((_, i) => {
    // Random positions within a spherical boundary
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2.5 + Math.random() * 1;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    return { position: [x, y, z], scale: Math.random() * 0.05 + 0.02 };
  });

  return (
    <>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position as [number, number, number]}>
          <sphereGeometry args={[particle.scale, 8, 8]} />
          <meshBasicMaterial color='#6a6aae' transparent opacity={0.7} />
        </mesh>
      ))}
    </>
  );
};

// Main component
const BrainAnimation: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}>
      <CanvasContainer>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Brain />
          <Particles />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </CanvasContainer>
    </motion.div>
  );
};

export default BrainAnimation;
