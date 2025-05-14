import React from 'react';

const climateCards = [
  'GPS-Based Climate Tracking',
  'Disaster & Weather Alerts',
  'Agri-News Integration'
];

const Climate = () => {
  return (
    <section className="p-8 bg-green-50">
      <h3 className="text-2xl font-bold mb-4">Climate Intelligence & Geo-Contextual Alerts</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {climateCards.map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow">
            <p className="font-semibold">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Climate;
