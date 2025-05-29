import React from "react";
import './CommunityAR.css';
import arimg from "../assets/ar.jpg"; // Background image

const CommunityAR = () => {
  return (
    <section
      className="community-ar-section"
      style={{ backgroundImage: `url(${arimg})` }}
    >
      {/* Black transparent overlay */}
      <div className="dark-overlay"></div>

      <div className="overlay-content">
        <h3 className="section-title">🌾 VR Farm World Immersive Experience</h3>
        <div className="card">
          <a
            href="/frame.html"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <p className="card-title">Launch VR Experience</p>
            <p className="card-desc">
              Step into our interactive VR farm world and explore modern agriculture through a fully immersive and educational experience.
            </p>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CommunityAR;
