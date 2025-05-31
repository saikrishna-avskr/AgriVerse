import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './Climate.module.css'; // Import CSS module for styling
import cliImage from '../assets/cli.png';   // Import climate image asset

// Array of card data for climate features
const climateCards = [
  { label: "GPS-Based Climate Tracking", route: "/weather" },
  { label: "Agri-News Integration", route: "/agri-news" },
];

const Climate = () => {
  const navigate = useNavigate();           // React Router navigation hook
  const sectionRef = useRef(null);          // Ref for the section element
  const [inView, setInView] = useState(false); // Track if section is in viewport
  const [hovered, setHovered] = useState(false); // Track hover state

  // Handle card click to navigate to the respective route
  const handleCardClick = (route) => {
    if (route) navigate(route);
  };

  // Set up IntersectionObserver to trigger animation when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`
        ${styles['climate-section']} 
        ${inView ? styles['active'] : ''} 
        ${hovered ? styles['zoomed'] : ''}
      `}
      onMouseEnter={() => setHovered(true)}   // Enable zoomed view on hover
      onMouseLeave={() => setHovered(false)}  // Disable zoomed view on mouse leave
    >
      {/* Show zoomed content with image and description when hovered */}
      {hovered && (
        <div className={styles['zoomed-content']}>
          <img src={cliImage} alt="Climate Insight" className={styles['zoomed-img']} />
          <div className={styles['zoomed-text']}>
            <h3>Explore Climate & Agriculture</h3>
            <p>
              Get real-time weather updates, GPS-based insights, and agri-news directly tailored to your location. Enhance your farming decisions with intelligent, data-driven tools.
            </p>
          </div>
        </div>
      )}

      {/* Show section title when not hovered */}
      {!hovered && (
        <h3 className={styles['climate-title']}>
          Climate Intelligence & Geo-Contextual Alerts
        </h3>
      )}

      {/* Render climate feature cards */}
      <div className={styles['climate-grid']}>
        {climateCards.map((item, i) => (
          <div
            key={i}
            className={styles['climate-card']}
            onClick={() => handleCardClick(item.route)}
          >
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Climate;
