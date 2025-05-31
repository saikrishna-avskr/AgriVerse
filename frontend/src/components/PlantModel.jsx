// src/components/PlantModel.jsx

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

// Plant component loads and renders the 3D plant model using GLTF loader
const Plant = () => {
  // Load the GLTF scene from the specified path
  const { scene } = useGLTF('/assets/plant.glb');
  // Render the loaded 3D scene as a primitive object
  return <primitive object={scene} />;
};

// PlantModel component sets up the 3D canvas and displays the Plant model
const PlantModel = () => {
  return (
    // Container div for responsive sizing and centering
    <div style={{ width: '100%', maxWidth: '600px', height: '400px', margin: '0 auto' }}>
      <Canvas>
        {/* Suspense is used to handle asynchronous loading of the 3D model */}
        <Suspense fallback={null}>
          <Plant />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PlantModel;
