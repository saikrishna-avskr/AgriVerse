// src/components/PlantModel.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const Plant = () => {
  const { scene } = useGLTF('/assets/plant.glb'); // Load without modifying
  return <primitive object={scene} />;
};

const PlantModel = () => {
  return (
    <div style={{ width: '100%', maxWidth: '600px', height: '400px', margin: '0 auto' }}>
      <Canvas>
        <Suspense fallback={null}>
          <Plant />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PlantModel;
