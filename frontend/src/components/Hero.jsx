import React, { useEffect, useState } from 'react';
import './Hero.css';

const Hero = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch(
      'https://api.openweathermap.org/data/2.5/weather?q=Hyderabad&appid=98e31420e53e16bac8c05e72e823f160&units=metric'
    )
      .then((res) => res.json())
      .then((data) => setWeather(data));
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h2 className="hero-heading">
          Welcome to <span className="highlight">AgriVerse</span>
        </h2>
        <p className="hero-text">
          Empowering farmers and growers with <strong>AI</strong>, climate insights, and a
          supportive community for <em>sustainable agriculture</em>.
        </p>
      </div>

      {/* AI Tip of the Day */}
      <div className="ai-tip-container">
        <p className="ai-tip-text">💡 AI Tip of the Day</p>
        <div className="ai-tip-popup">
          Use AI-powered image analysis to detect crop diseases early and reduce losses.
        </div>
      </div>

      {/* Weather Report */}
      <div className="weather-report-container">
        <p className="weather-report-text">🌤 Weather Report</p>
        <div className="weather-popup">
          {weather ? (
            <>
              <strong>{weather.name}</strong><br />
              {weather.weather[0].description}<br />
              🌡 {weather.main.temp}°C<br />
              💧 Humidity: {weather.main.humidity}%<br />
              💨 Wind: {weather.wind.speed} m/s
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
