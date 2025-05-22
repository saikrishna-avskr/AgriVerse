import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CropManagement.module.css"; // ✅ CSS Module import
import aicropImage from "../assets/aicrop.png"; // ✅ Image import

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
    <section className={styles["crop-section"]}>
      <h3 className={styles["section-title"]}>🌿 AI Powered Crop Management</h3>

      <div className={styles["card-container"]}>
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

      <div className={styles["aicrop-wrapper"]}>
        <img
          src={aicropImage}
          alt="AI Crop Management"
          className={styles["aicrop-img"]}
        />
        <div className={styles["aicrop-overlay"]}>
          <div className={styles["aicrop-text"]}>
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
