import React from "react";

const CommunityAR = () => {
  return (
    <section className="p-8 bg-white">
      <h3 className="text-2xl font-bold mb-4">
        AR Farm World Immersive Experience
      </h3>
      <div className="bg-green-50 p-6 rounded-xl shadow hover:bg-green-100 transition">
        <a
          href="/frame.html"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <p className="font-semibold text-lg mb-1">Launch AR Experience</p>
          <p className="text-sm text-gray-600">
            Step into our interactive AR farm world and learn about modern
            agriculture in an engaging, immersive environment.
          </p>
        </a>
      </div>
    </section>
  );
};

export default CommunityAR;
