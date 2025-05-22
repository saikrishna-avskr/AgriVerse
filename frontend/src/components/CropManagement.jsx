import React from "react";
import "./CropManagement.css";
import { useNavigate } from "react-router-dom";
import aicropImage from "../assets/aicrop.png"; // ✅ import image from assets

const cropCards = [
  { label: "Automated Disease Detection", route: "/disease-detection" },
  { label: "AI-Powered Crop & Garden Guidance", route: "/guidance" },
  { label: "Predictive Yield Analysis", route: "/yield-predictor" },
  { label: "Smart Crop Rotation Planning", route: "/crop-rotation" },
];

const CropManagement = () => {
  const navigate = useNavigate();

  const handleCardClick = (route) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <section className="crop-section">
      <h3 className="section-title">🌿 AI Powered Crop Management</h3>

      <div className="card-container">
        {cropCards.map((item, i) => (
          <div
            key={i}
            className="card"
            onClick={() => handleCardClick(item.route)}
          >
            <p>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Image with hover info */}
      <div className="aicrop-wrapper">
        <img
          src={aicropImage}
          alt="AI Crop Management"
          className="aicrop-img"
        />
        <div className="aicrop-overlay">
          <div className="aicrop-text">
            <h4>AI-Powered Crop Management</h4>
            <p>
              Leveraging artificial intelligence to monitor crop health, predict
              yields, and enhance sustainable farming practices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CropManagement;
