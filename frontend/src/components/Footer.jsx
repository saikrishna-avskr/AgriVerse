import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Bounds } from '@react-three/drei';
import { FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Plant = () => {
  const { scene } = useGLTF('/assets/plant.glb');
  return (
    <group rotation={[0, Math.PI, 0]} position={[0, -5.5, 0]}>
      <primitive object={scene} />
    </group>
  );
};

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        <h2 className="cta-text">
          🌱 Let's grow the future together!
        </h2>
        <p className="contact-line">
          Contact us at: 
          <a href="mailto:agriverse.ag@gmail.com" className="email-link">
            <FaEnvelope className="email-icon" /> agriverse.ag@gmail.com
          </a>
        </p>
      </div>

      <div className="footer-model-wrapper">
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
    </footer>
  );
};

export default Footer;
