import React from "react";
import styles from "./CropManagement.module.css"; // ✅ use module
import { useNavigate } from "react-router-dom";
import aicropImage from "../assets/aicrop.png";

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
    <section className={styles.cropSection}>
      <h3 className={styles.sectionTitle}>🌿 AI Powered Crop Management</h3>

      <div className={styles.cardContainer}>
        {cropCards.map((item, i) => (
          <div
            key={i}
            className={styles.card}
            onClick={() => handleCardClick(item.route)}
          >
            <p>{item.label}</p>
          </div>
        ))}
      </div>

      <div className={styles.aicropWrapper}>
        <img src={aicropImage} alt="AI Crop Management" className={styles.aicropImg} />
        <div className={styles.aicropOverlay}>
          <div className={styles.aicropText}>
            <h4>AI-Powered Crop Management</h4>
            <p>
              Leveraging artificial intelligence to monitor crop health,
              predict yields, and enhance sustainable farming practices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CropManagement;
