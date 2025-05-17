import React from 'react';
import { useNavigate } from 'react-router-dom';
import terraceImage2 from "../assets/ter4.jpg";

const TerraceGardeners = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/terrace'); // Adjust based on your route setup
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer transition-transform duration-300 hover:scale-105"
    >
      <div className="grid md:grid-cols-2 gap-6 bg-gradient-to-r from-green-300 via-lime-200 to-green-100 shadow-xl rounded-2xl p-6 md:p-10 items-center hover:shadow-2xl">
        
        {/* Image Section */}
        <div className="rounded-xl overflow-hidden shadow-md">
          <img
            src={terraceImage2}
            alt="Terrace Gardening"
            className="w-full h-64 md:h-80 object-cover"
          />
        </div>

        {/* Text Section */}
        <div className="text-center md:text-left">
          <h3 className="text-3xl font-bold text-green-800 mb-4">
            🌿 Homegrower’s Hub
          </h3>
          <p className="text-green-900 font-medium text-lg mb-4">
            Discover tools, tips & smart DIY setups to start your own garden from your balcony, rooftop, or backyard.
          </p>
          <button className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 shadow-md transition-all duration-300">
            Explore Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TerraceGardeners;
