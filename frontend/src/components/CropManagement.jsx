import React from 'react';
import './CropManagement.css'; // Link to the custom CSS

const cropCards = [
  'Automated Disease Detection',
  'Personalized Crop Guidance',
  'Predictive Yield Analysis',
  'Smart Crop Rotation Planning',
];

const CropManagement = () => {
  return (
    <section className="crop-section">
      <h3 className="section-title">AI Powered Crop Management</h3>
      <div className="card-container">
        {cropCards.map((item, i) => (
          <div key={i} className="card">
            <p>{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CropManagement;
