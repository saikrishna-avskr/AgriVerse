import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

// ✅ Importing images for background slides
import bg1 from '../assets/bg1.png';
import bg2 from '../assets/bg1.jpg';
import bg3 from '../assets/bg3.jpg';
import sun2 from '../assets/sun2.png';
import tq from '../assets/tq.jpg';

// Crop management card data
const cropCards = [
  { label: "Disease Detection", route: "/disease-detection", icon: "🔬" },
  { label: "Crop Guidance", route: "/guidance", icon: "🌱" },
  { label: "Yield Analysis", route: "/yield-predictor", icon: "📊" },
  { label: "Crop Rotation", route: "/crop-rotation", icon: "🔄" },
];

const Hero = () => {
  // State for weather data and current slide index
  const [weather, setWeather] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const navigate = useNavigate();

  // Array of background images for slides
  const bgImages = [sun2, bg2, bg3, bg1, tq]; // 5 slides

  // Auto-advance slides every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % 5); // 5 slides
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Fetch live weather data for Hyderabad on mount
  useEffect(() => {
    fetch(
      'https://api.openweathermap.org/data/2.5/weather?q=Hyderabad&appid=98e31420e53e16bac8c05e72e823f160&units=metric'
    )
      .then((res) => res.json())
      .then((data) => setWeather(data));
  }, []);

  // Navigate to a specific route when a crop card is clicked
  const handleCardClick = (route) => {
    if (route) navigate(route);
  };

  // Navigate to AgriNews page
  const handleAgriNewsClick = () => {
    navigate('/agri-news');
  };

  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${bgImages[slideIndex]})` }}
    >
      <div className="hero-overlay">
        {/* Slide 1 - Welcome message and features */}
        {slideIndex === 0 && (
          <div className="hero-content welcome-slide">
            <div className="content-card">
              <h2 className="hero-heading">
                Welcome to <span className="highlight">AgriVerse</span>
              </h2>
              <p className="hero-text">
                Empowering farmers and growers with <strong>AI</strong>, climate insights, and a
                supportive community for <em>sustainable agriculture</em>.
              </p>
              <div className="features-list">
                <span className="feature-tag">Agri Input Advisory</span>
                <span className="feature-tag">Health & Growth</span>
                <span className="feature-tag">Farm Intelligence</span>
                <span className="feature-tag">VR Farm World</span>
              </div>
            </div>
          </div>
        )}

        {/* Slide 2 - AI Tip and Live Weather Report */}
        {slideIndex === 1 && (
          <div className="hero-content info-slide">
            <div className="content-card">
              {/* AI Tip Section */}
              <div className="info-section">
                <h3 className="section-title">💡 AI Tip of the Day</h3>
                <div className="info-popup tip-popup">
                  Use AI-powered image analysis to detect crop diseases early and reduce losses by up to 40%.
                </div>
              </div>
              {/* Weather Section */}
              <div className="info-section">
                <h3 className="section-title">🌤 Live Weather Report</h3>
                <div className="info-popup weather-popup">
                  {weather ? (
                    <div className="weather-details">
                      <div className="weather-location">{weather.name}</div>
                      <div className="weather-desc">{weather.weather[0].description}</div>
                      <div className="weather-stats">
                        <span>🌡 {weather.main.temp}°C</span>
                        <span>💧 {weather.main.humidity}%</span>
                        <span>
                          💨 {weather.wind.speed} m/s</span>
                      </div>
                      <button
                        className="agri-news-btn"
                        onClick={() => window.location.href = "/weather"}
                      >
                        Get Forecast
                      </button>
                    </div>
                  ) : (
                    <div className="loading">Loading weather data...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 3 - Crop Management Cards */}
        {slideIndex === 2 && (
          <div className="hero-content crop-management-slide">
            <div className="content-card">
              <h3 className="section-title">🌿 AI Powered Crop Management</h3>
              {/* Crop management feature cards */}
              <div className="crop-cards-grid">
                {cropCards.map((item, i) => (
                  <div 
                    key={i} 
                    className="crop-card" 
                    onClick={() => handleCardClick(item.route)}
                  >
                    <div className="card-icon">{item.icon}</div>
                    <div className="card-label">{item.label}</div>
                  </div>
                ))}
              </div>
              {/* Description for crop management */}
              <div className="crop-description">
                <h4>Smart Agriculture Solutions</h4>
                <p>
                  Leveraging artificial intelligence to monitor crop health, predict yields, 
                  and enhance sustainable farming practices for maximum productivity.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Slide 4 - AgriNews and Vision */}
        {slideIndex === 3 && (
          <div className="hero-content vision-slide">
            <div className="content-card">
              {/* AgriNews Section */}
              <div className="agri-news-section">
                <h3 className="section-title">📰 Stay Updated with AgriNews</h3>
                <p className="agri-news-desc">
                  Get the latest agricultural news, market trends, and farming insights 
                  to make informed decisions for your agricultural ventures.
                </p>
                <button className="agri-news-btn" onClick={handleAgriNewsClick}>
                  Explore AgriNews →
                </button>
              </div>
              {/* Vision & Mission is on next slide */}
            </div>
          </div>
        )}

        {/* Slide 5 - Vision & Mission */}
        {slideIndex === 4 && (
          <div className="hero-content vision-slide">
            <div className="content-card">
              {/* Vision & Mission Section */}
              <div className="vision-mission-section">
                <h2 className="hero-heading">🌱 Our Vision & Mission</h2>
                <div className="vision-content">
                  <div className="vision-item">
                    <h4>🎯 Vision</h4>
                    <p>A future where technology empowers every farmer, ensuring food security, sustainability, and prosperity.</p>
                  </div>
                  <div className="mission-item">
                    <h4>🚀 Mission</h4>
                    <p>Revolutionizing agriculture through AI, data analytics, and community-driven solutions.</p>
                  </div>
                </div>
                <p className="cta-text">🙏 Thank you for being part of the AgriVerse journey!</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Dots for manual slide selection */}
        <div className="slide-navigation">
          {[0, 1, 2, 3, 4].map((index) => (
            <button
              key={index}
              className={`nav-dot ${slideIndex === index ? 'active' : ''}`}
              onClick={() => setSlideIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <span className="dot-number">{index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;