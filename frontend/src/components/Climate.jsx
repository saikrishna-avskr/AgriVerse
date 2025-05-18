import React from 'react';
import { useNavigate } from "react-router-dom";

const climateCards = [
  { label: "GPS-Based Climate Tracking", route: "/weather" },
  { label: "Agri-News Integration", route: "/agri-news" },
];



const Climate = () => {
  const navigate = useNavigate();
  
    const handleCardClick = (route) => {
      if (route) {
        navigate(route);
      }
    };
  return (
    <section className="p-8 ">
      <h3 className="text-2xl font-bold mb-4">
        Climate Intelligence & Geo-Contextual Alerts
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center items-center">
        {climateCards.map((item, i) => (
          <div
            key={i}
            className="card"
            style={item.route ? { cursor: "pointer" } : {}}
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
