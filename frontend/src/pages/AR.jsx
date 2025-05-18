import React, { useEffect, useState } from 'react';

const AR = () => {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = 'https://aframe.io/releases/1.2.0/aframe.min.js';
    script1.async = true;

    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://cdn.rawgit.com/jeromeetienne/ar.js/1.7.6/aframe/build/aframe-ar.min.js';
      script2.async = true;

      script2.onload = () => {
        setScriptsLoaded(true); // Scripts are ready, now render the scene
      };

      document.body.appendChild(script2);
    };

    document.body.appendChild(script1);

    return () => {
      document.body.removeChild(script1);
    };
  }, []);

  return (
    <div style={{ height: '100vh' }}>
      {scriptsLoaded ? (
        <a-scene embedded arjs="sourceType: webcam;">
          <a-marker-camera></a-marker-camera>
          <a-box position="0 0.5 0" color="green"></a-box>
        </a-scene>
      ) : (
        <p className="text-center mt-10 text-lg font-semibold">Loading AR environment...</p>
      )}
    </div>
  );
};

export default AR;
