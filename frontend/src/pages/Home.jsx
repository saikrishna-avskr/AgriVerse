import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CropManagement from '../components/CropManagement';
import Climate from '../components/Climate';
import CommunityAR from '../components/CommunityAR';
import TerraceGardeners from '../components/TerraceGardeners';

const Home = () => {
  return (
    <div className="bg-white text-gray-900">
      <Navbar />
      <Hero />
      <CropManagement />
      <Climate />
      <CommunityAR />
      <TerraceGardeners />
    </div>
  );
};

export default Home;