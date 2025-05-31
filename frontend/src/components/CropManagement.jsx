// Render the Crop Management slide only when slideIndex is 2
{slideIndex === 2 && (
  <div className="hero-content crop-management-slide">
    {/* Section title for Crop Management */}
    <h3 className="section-title">🌿 AI Powered Crop Management</h3>

    {/* Render horizontal cards for each crop management feature */}
    <div className="horizontal-cards">
      {cropCards.map((item, i) => (
        <div
          key={i}
          className="horizontal-card"
          onClick={() => handleCardClick(item.route)} // Navigate on card click
        >
          <p>{item.label}</p>
        </div>
      ))}
    </div>

    {/* AI Crop Management image with overlay description */}
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
            {/* Description of AI-powered crop management benefits */}
            Leveraging artificial intelligence to monitor crop health,
            predict yields, and enhance sustainable farming practices.
          </p>
        </div>
      </div>
    </div>
  </div>
)}
