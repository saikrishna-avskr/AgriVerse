import React from 'react';
import { useNavigate } from 'react-router-dom';
import terraceImage2 from "../assets/ter2.png";
const TerraceGardeners = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/terrace'); // adjust based on your route setup
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer transition-transform duration-300 hover:scale-105"
    >
      <div className="bg-gradient-to-r from-green-300 via-lime-200 to-green-100 shadow-xl rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-2xl">
       <img src={terraceImage2} alt="Vertical Gardening" className="w-full h-80 object-cover" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          🌿 Homegrower’s Hub
        </h3>
        <p className="text-green-900 font-medium">
          Discover tools, tips & smart DIY setups to start your own garden from your balcony, rooftop, or backyard.
        </p>
        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 shadow-md">
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default TerraceGardeners;
