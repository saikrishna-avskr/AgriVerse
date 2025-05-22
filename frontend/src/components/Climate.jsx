import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './Climate.module.css'; // CSS module
import cliImage from '../assets/cli.png';

const climateCards = [
  { label: "GPS-Based Climate Tracking", route: "/weather" },
  { label: "Agri-News Integration", route: "/agri-news" },
];

const Climate = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCardClick = (route) => {
    if (route) navigate(route);
  };

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
      className={`${styles['climate-section']} ${inView ? styles['active'] : ''} ${hovered ? styles['zoomed'] : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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

      {!hovered && (
        <h3 className={styles['climate-title']}>
          Climate Intelligence & Geo-Contextual Alerts
        </h3>
      )}

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
