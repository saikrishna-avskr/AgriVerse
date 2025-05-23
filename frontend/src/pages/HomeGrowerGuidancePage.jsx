import React from "react";
import Navbar from "../components/Navbar";
import HomeGrowerGuidanceForm from "../components/HomeGrowerGuidanceForm";
import hgui2 from "../assets/hgui2.png";
import hgui3 from "../assets/hgui3.png";
import hgui4 from "../assets/hgui4.png";
import hgui5 from "../assets/hgui5.png";
import "./HomeGrowerGuidancePage.css";

export default function HomeGrowerGuidancePage() {
  return (
    <div className="home-grower-container">
      <Navbar />
      <div className="guidance-layout">
        <div className="image-column">
          <img src={hgui2} alt="Decoration" />
          <img src={hgui3} alt="Decoration" />
        </div>

        <div className="form-column">
          <HomeGrowerGuidanceForm />
        </div>

        <div className="image-column">
          <img src={hgui4} alt="Decoration" />
          <img src={hgui5} alt="Decoration" />
        </div>
      </div>
    </div>
  );
}
