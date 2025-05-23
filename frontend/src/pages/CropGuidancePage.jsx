import React from "react";
import Navbar from "../components/Navbar";
import CropGuidanceForm from "../components/CropGuidanceForm";
import gui2 from "../assets/gui2.png";
import gui3 from "../assets/gui3.png";
import gui4 from "../assets/gui4.png";
import gui5 from "../assets/gui5.png";
import "./CropGuidancePage.css";

export default function CropGuidancePage() {
  return (
    <div className="crop-guidance-container">
      <Navbar />
      <div className="guidance-layout">
        <div className="image-column">
          <img src={gui2} alt="Decoration" />
          <img src={gui3} alt="Decoration" />
        </div>

        <div className="form-column">
          <CropGuidanceForm />
        </div>

        <div className="image-column">
          <img src={gui4} alt="Decoration" />
          <img src={gui5} alt="Decoration" />
        </div>
      </div>
    </div>
  );
}
