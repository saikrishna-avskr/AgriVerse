import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Bounds } from '@react-three/drei';
import './Hero.css';

const Plant = () => {
  const { scene } = useGLTF('/assets/plant.glb');

  return (
    <group rotation={[0, Math.PI, 0]}>
      {/* rotate 180° to show front view if back is facing camera */}
      <primitive object={scene} />
    </group>
  );
};

const Hero = () => {
  return (
    <section className="hero-section">
      <h2 className="hero-heading">
        Welcome to <span className="highlight">AgriVerse</span>
      </h2>
      <p className="hero-text">
        Empowering farmers and growers with <strong>AI</strong>, climate insights, and a
        supportive community for <em>sustainable agriculture</em>.
      </p>

      <div className="model-wrapper">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 3, 3]} intensity={1} />
          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.2}>
              <Plant />
            </Bounds>
          </Suspense>
          <OrbitControls autoRotate={false} />
        </Canvas>
      </div>
    </section>
  );
};

export default Hero;
