import React from "react";
import "./CropManagement.css"; // Link to the custom CSS
import { useNavigate } from "react-router-dom";

const cropCards = [
  { label: "Automated Disease Detection", route: "/disease-detection" },
  { label: "AI-Powered Crop & Garden Guidance", route: "/guidance" },
  { label: "Predictive Yield Analysis", route: null },
  { label: "Smart Crop Rotation Planning", route: null },
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
      <h3 className="section-title">AI Powered Crop Management</h3>
      <div className="card-container">
        {cropCards.map((item, i) => (
          <div
            key={i}
            className="card"
            style={item.route ? { cursor: "pointer" } : {}}
            onClick={() => handleCardClick(item.route)}
          >
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CropManagement;
