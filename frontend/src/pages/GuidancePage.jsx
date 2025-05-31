import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import gui1 from "../assets/gui2.png"; // Decorative image (left)
import gui2 from "../assets/hgui1.png"; // Decorative image (right)
import "./GuidancePage.css"; // Page-specific styles

// GuidancePage: Lets users choose between farmer and home grower guidance
export default function GuidancePage() {
  const navigate = useNavigate(); // React Router navigation hook

  return (
    <div className="guidance-container">
      {/* Top navigation bar */}
      <Navbar />
      {/* Main heading */}
      <h1 className="guidance-heading">
        🌱 AI-Powered Crop & Garden Guidance 🌾
      </h1>

      {/* Decorative Images on left and right */}
      <img src={gui1} alt="Decoration 1" className="decoration-image left-img" />
      <img src={gui2} alt="Decoration 2" className="decoration-image right-img" />

      {/* Card grid for user choices */}
      <div className="card-grid">
        {/* Farmer Card */}
        <div className="flash-card farmer-card">
          <h2>🌾 I'm a Farmer</h2>
          <p>
            Get AI-powered crop guidance based on soil, climate, and region to
            boost your yield.
          </p>
          {/* Button navigates to crop guidance form */}
          <button
            className="guidance-button"
            onClick={() => navigate("/crop-guidance")}
          >
            Get Guidance
          </button>
        </div>

        {/* Home Grower Card */}
        <div className="flash-card home-card">
          <h2>🏡 I'm a Home Grower</h2>
          <p>
            Personalized plant care, setup tips, and garden advice for your
            balcony, terrace, or backyard.
          </p>
          {/* Button navigates to home grower guidance form */}
          <button
            className="guidance-button"
            onClick={() => navigate("/home-grower-guidance")}
          >
            Get Guidance
          </button>
        </div>
      </div>
    </div>
  );
}
