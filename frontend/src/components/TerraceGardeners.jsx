import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// TerraceGardeners component displays a slideshow with gardening tips and inspiration
const TerraceGardeners = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [currentSlide, setCurrentSlide] = useState(0); // State to track current slide index

  // Handle click on slideshow to navigate to /terrace route
  const handleClick = () => {
    navigate('/terrace');
  };

  // Automatically switch slides every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === 0 ? 1 : 0)); // Toggle between slides
    }, 3000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Array of slide data: image, title, and content
  const slides = [
    {
      image: '/src/assets/ter4.jpg', // Path to first slide image
      title: "🌿 Homegrower's Hub",
      content: "Discover tools, tips & smart DIY setups to start your own garden from your balcony, rooftop, or backyard. Transform your space into a green paradise and embrace sustainable living with our comprehensive gardening solutions."
    },
    {
      image: '/src/assets/hgui1.png', // Path to second slide image
      title: "HomeGrower's Paradise",
      content: (
        <div className="tips-content">
          <div className="tip-item">
            <strong>Getting Started:</strong> Use lightweight containers, good potting mix, and ensure sunlight & drainage.
          </div>
          <div className="tip-item">
            <strong>DIY Ideas:</strong> Vertical gardens, composting, and DIY drip irrigation.
          </div>
          <div className="tip-item">
            <strong>Sustainable Tips:</strong> Rainwater harvesting, native plants, organic gardening.
          </div>
          <div className="tip-item">
            <strong>Real Stories:</strong> Inspiration from Indian home gardeners.
          </div>
        </div>
      )
    }
  ];

  return (
    // Slideshow container, navigates to /terrace on click
    <div className="slideshow-container" onClick={handleClick}>
      {/* Render each slide; only the active slide is visible */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === currentSlide ? 'active' : ''}`}
        >
          <div className="slide-background">
            {/* Slide image */}
            <img src={slide.image} alt={`Slide ${index + 1}`} className="slide-image" />
            <div className="overlay"></div> {/* Dark overlay for readability */}
          </div>
          <div className="slide-content">
            <div className="content-card">
              <h2 className="slide-title">{slide.title}</h2>
              <div className="slide-description">
                {slide.content}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Slide indicators (dots) */}
      <div className="slide-indicators">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
          />
        ))}
      </div>
      
      {/* Inline CSS for component styling */}
      <style jsx>{`
        .slideshow-container {
          position: relative;
          width: 100%;
          height: 600px;
          margin: 0.3rem;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }

        .slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transform: translateX(100%);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .slide.active {
          opacity: 1;
          transform: translateX(0);
        }

        .slide-background {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .slide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
        }

        .slide-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          width: 90%;
          max-width: 600px;
        }

        .content-card {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2.5rem;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: slideUp 0.8s ease-out;
        }

        .slide-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .slide-description {
          font-size: 1.1rem;
          color: #e5e7eb;
          line-height: 1.6;
        }

        .tips-content {
          text-align: left;
        }

        .tip-item {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border-left: 3px solid #22c55e;
        }

        .tip-item strong {
          color: #22c55e;
          font-weight: 600;
        }

        .slide-indicators {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 10;
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .indicator.active {
          background: #22c55e;
          transform: scale(1.2);
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive styles for tablets */
        @media (max-width: 768px) {
          .slideshow-container {
            height: 400px;
            margin: 1rem;
          }

          .content-card {
            padding: 2rem;
          }

          .slide-title {
            font-size: 1.8rem;
          }

          .slide-description {
            font-size: 1rem;
          }
        }

        /* Responsive styles for mobile */
        @media (max-width: 480px) {
          .slideshow-container {
            height: 350px;
          }

          .content-card {
            padding: 1.5rem;
          }

          .slide-title {
            font-size: 1.5rem;
          }

          .tip-item {
            padding: 0.5rem;
            margin-bottom: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TerraceGardeners;