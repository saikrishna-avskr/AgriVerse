import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import terraceImage2 from '../assets/ter4.jpg';
import styles from './TerraceGardeners.module.css'; // create this CSS Module file

const TerraceGardeners = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  const handleClick = () => {
    navigate('/terrace');
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles['terrace-section']} ${inView ? styles['active'] : ''} ${hovered ? styles['zoomed'] : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <div className={styles['content-wrapper']}>

        {/* Image */}
        <div className={styles['image-box']}>
          <img src={terraceImage2} alt="Terrace Gardening" className={styles['terrace-img']} />
        </div>

        <div className={styles['text-box']}>
  {!hovered ? (
    <>
      <h3 className={styles['title']}>🌿 Homegrower’s Hub</h3>
      <p className={styles['subtitle']}>
        Discover tools, tips & smart DIY setups to start your own garden from your balcony, rooftop, or backyard.
      </p>
    </>
  ) : (
    <div className={styles['card']}>
      <h4 className={styles['card-title']}>HomeGrower's Paradise: Terrace Gardening Guide</h4>
      <ul className={styles['card-list']}>
        <li> <strong>Getting Started:</strong> Use lightweight containers, good potting mix, and ensure sunlight & drainage.</li>
        <li><strong>DIY Ideas:</strong> Vertical gardens, composting, and DIY drip irrigation.</li>
        <li><strong>Sustainable Tips:</strong> Rainwater harvesting, native plants, organic gardening.</li>
        <li> <strong>Real Stories:</strong> Inspiration from Indian home gardeners.</li>
      </ul>
      {/* <button className={styles['btn']} onClick={handleClick}>Explore Now</button> */}
    </div>
  )}
</div>


      </div>
    </section>
  );
};

export default TerraceGardeners;
