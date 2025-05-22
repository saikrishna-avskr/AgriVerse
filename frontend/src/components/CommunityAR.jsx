import React from "react";
import './CommunityAR.css';
import arimg from "../assets/ar.jpg"; // Import the image properly

const CommunityAR = () => {
  return (
    <section
      className="community-ar-section"
      style={{ backgroundImage: `url(${arimg})` }}
    >
      <div className="overlay-content">
        <h3 className="section-title">AR Farm World Immersive Experience</h3>
        <div className="card">
          <a
            href="/frame.html"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <p className="card-title">Launch AR Experience</p>
            <p className="card-desc">
              Step into our interactive AR farm world and learn about modern agriculture in an engaging, immersive environment.
            </p>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CommunityAR;
