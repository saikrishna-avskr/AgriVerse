import React from "react";
import Navbar from "../components/Navbar"; // Top navigation bar
import CropGuidanceForm from "../components/CropGuidanceForm"; // Main crop guidance form
import gui2 from "../assets/gui2.png"; // Decorative image
import gui3 from "../assets/gui3.png"; // Decorative image
import gui4 from "../assets/gui4.png"; // Decorative image
import gui5 from "../assets/gui5.png"; // Decorative image
import "./CropGuidancePage.css"; // Page-specific styles

// CropGuidancePage: Layout for the crop guidance feature
export default function CropGuidancePage() {
  return (
    <div className="crop-guidance-container">
      {/* Navigation bar at the top */}
      <Navbar />
      {/* Main layout: images on sides, form in the center */}
      <div className="guidance-layout">
        {/* Left column with decorative images */}
        <div className="image-column">
          <img src={gui2} alt="Decoration" />
          <img src={gui3} alt="Decoration" />
        </div>

        {/* Center column with the crop guidance form */}
        <div className="form-column">
          <CropGuidanceForm />
        </div>

        {/* Right column with decorative images */}
        <div className="image-column">
          <img src={gui4} alt="Decoration" />
          <img src={gui5} alt="Decoration" />
        </div>
      </div>
    </div>
  );
}
