import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import gui1 from "../assets/gui2.png";
import gui2 from "../assets/hgui1.png";
import "./GuidancePage.css";

export default function GuidancePage() {
  const navigate = useNavigate();

  return (
    <div className="guidance-container">
      <Navbar />
      <h1 className="guidance-heading">
        🌱 AI-Powered Crop & Garden Guidance 🌾
      </h1>

      {/* Decorative Images */}
      <img src={gui1} alt="Decoration 1" className="decoration-image left-img" />
      <img src={gui2} alt="Decoration 2" className="decoration-image right-img" />

      <div className="card-grid">
        {/* Farmer Card */}
        <div className="flash-card farmer-card">
          <h2>🌾 I'm a Farmer</h2>
          <p>
            Get AI-powered crop guidance based on soil, climate, and region to
            boost your yield.
          </p>
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
