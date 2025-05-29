{slideIndex === 2 && (
  <div className="hero-content crop-management-slide">
    <h3 className="section-title">🌿 AI Powered Crop Management</h3>

    <div className="horizontal-cards">
      {cropCards.map((item, i) => (
        <div
          key={i}
          className="horizontal-card"
          onClick={() => handleCardClick(item.route)}
        >
          <p>{item.label}</p>
        </div>
      ))}
    </div>

    <div className="aicrop-wrapper">
      <img
        src={aicropImage}
        alt="AI Crop Management"
        className="aicrop-img"
      />
      <div className="aicrop-overlay">
        <div className="aicrop-text">
          <h4>AI-Powered Crop Management</h4>
          <p>
            Leveraging artificial intelligence to monitor crop health,
            predict yields, and enhance sustainable farming practices.
          </p>
        </div>
      </div>
    </div>
  </div>
)}
