import React from "react";
import Navbar from "../components/Navbar"; // Top navigation bar
import HomeGrowerGuidanceForm from "../components/HomeGrowerGuidanceForm"; // Main form for home growers
import hgui2 from "../assets/hgui2.png"; // Decorative image (left)
import hgui3 from "../assets/hgui3.png"; // Decorative image (left)
import hgui4 from "../assets/hgui4.png"; // Decorative image (right)
import hgui5 from "../assets/hgui5.png"; // Decorative image (right)
import "./HomeGrowerGuidancePage.css"; // Page-specific styles

// HomeGrowerGuidancePage: Layout for personalized home grower guidance
export default function HomeGrowerGuidancePage() {
  return (
    <div className="home-grower-container">
      {/* Top navigation bar */}
      <Navbar />
      {/* Main layout: images on sides, form in the center */}
      <div className="guidance-layout">
        {/* Left column with decorative images */}
        <div className="image-column">
          <img src={hgui2} alt="Decoration" />
          <img src={hgui3} alt="Decoration" />
        </div>

        {/* Center column with the home grower guidance form */}
        <div className="form-column">
          <HomeGrowerGuidanceForm />
        </div>

        {/* Right column with decorative images */}
        <div className="image-column">
          <img src={hgui4} alt="Decoration" />
          <img src={hgui5} alt="Decoration" />
        </div>
      </div>
    </div>
  );
}
