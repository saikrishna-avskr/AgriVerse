import React, { useEffect, useState } from 'react';

// AR component: Loads A-Frame and AR.js scripts, then renders a simple AR scene
const AR = () => {
  // State to track if external scripts are loaded
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    // Dynamically create and load the A-Frame script
    const script1 = document.createElement('script');
    script1.src = 'https://aframe.io/releases/1.2.0/aframe.min.js';
    script1.async = true;

    // Once A-Frame is loaded, load AR.js for marker-based AR
    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://cdn.rawgit.com/jeromeetienne/ar.js/1.7.6/aframe/build/aframe-ar.min.js';
      script2.async = true;

      // When both scripts are loaded, update state to render the AR scene
      script2.onload = () => {
        setScriptsLoaded(true); // Scripts are ready, now render the scene
      };

      document.body.appendChild(script2);
    };

    // Add the first script to the document
    document.body.appendChild(script1);

    // Cleanup: Remove the A-Frame script when component unmounts
    return () => {
      document.body.removeChild(script1);
    };
  }, []);

  return (
    // Full viewport container for AR scene or loading message
    <div style={{ height: '100vh' }}>
      {scriptsLoaded ? (
        // Render the AR scene using A-Frame and AR.js
        <a-scene embedded arjs="sourceType: webcam;">
          {/* Camera marker for AR.js */}
          <a-marker-camera></a-marker-camera>
          {/* Simple green box as AR object */}
          <a-box position="0 0.5 0" color="green"></a-box>
        </a-scene>
      ) : (
        // Show loading message while scripts are being loaded
        <p className="text-center mt-10 text-lg font-semibold">Loading AR environment...</p>
      )}
    </div>
  );
};

export default AR;
