import React from "react";
import './CommunityAR.css';
import arimg from "../assets/ar.jpg"; // Background image

// CommunityAR component displays a VR farm world immersive experience section
const CommunityAR = () => {
  return (
    // Section with background image and overlay
    <section
      className="community-ar-section"
      style={{ backgroundImage: `url(${arimg})` }}
    >
      {/* Black transparent overlay for better text readability */}
      <div className="dark-overlay"></div>

      {/* Main content displayed over the overlay */}
      <div className="overlay-content">
        {/* Section title */}
        <h3 className="section-title">🌾 VR Farm World Immersive Experience</h3>
        <div className="card">
          {/* Link to launch the VR experience in a new tab */}
          <a
            href="/frame.html"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            {/* Card title */}
            <p className="card-title">Launch VR Experience</p>
            {/* Card description */}
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
