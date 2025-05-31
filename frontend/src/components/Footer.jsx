import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Bounds } from '@react-three/drei';
import { FaEnvelope } from 'react-icons/fa';
import './Footer.css';

// Plant component: Loads and renders a 3D plant model using GLTF loader
const Plant = () => {
  // Load the GLTF model from the public assets folder
  const { scene } = useGLTF('/assets/plant.glb');
  return (
    // Adjust the rotation and position for better display in the scene
    <group rotation={[0, Math.PI, 0]} position={[0, -5.5, 0]}>
      <primitive object={scene} />
    </group>
  );
};

// Footer component: Displays footer content and a 3D plant model
const Footer = () => {
  return (
    <footer className="footer-section">
      {/* Text content and contact info */}
      <div className="footer-content">
        <h2 className="cta-text">
          {/* Call-to-action headline */}
          🌱 Let's grow the future together!
        </h2>
        <p className="contact-line">
          Contact us at: 
          {/* Email link with envelope icon */}
          <a href="mailto:agriverse.ag@gmail.com" className="email-link">
            <FaEnvelope className="email-icon" /> agriverse.ag@gmail.com
          </a>
        </p>
      </div>

      {/* 3D model viewer section */}
      <div className="footer-model-wrapper">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          {/* Ambient and directional lighting for the scene */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 3, 3]} intensity={1} />
          {/* Suspense for async model loading */}
          <Suspense fallback={null}>
            {/* Bounds ensures the model fits nicely in the view */}
            <Bounds fit clip observe margin={1.2}>
              <Plant />
            </Bounds>
          </Suspense>
          {/* OrbitControls allows user to rotate the model */}
          <OrbitControls autoRotate={false} />
        </Canvas>
      </div>
    </footer>
  );
};

export default Footer;
