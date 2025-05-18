import React from 'react';

const CommunityAR = () => {
  return (
    <section className="p-8 bg-white">
      <h3 className="text-2xl font-bold mb-4 ">Community, Education & AR Learning</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Clickable Card for Frame.VR */}
        <a
          href="https://framevr.io/agriverse"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-50 p-4 rounded-xl shadow hover:bg-green-100 transition"
        >
          <p className="font-semibold">Frame.VR</p>
          <p className="text-sm text-gray-600">Enter our immersive hub world for community and AR learning.</p>
        </a>

        {/* Static Card for Community Forums */}
        <div className="bg-green-50 p-4 rounded-xl shadow">
          <p className="font-semibold">Community Discussion Forums</p>
        </div>
      </div>
    </section>
  );
};

export default CommunityAR;
