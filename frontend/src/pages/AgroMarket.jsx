import React from 'react';
import ToolSearch from '../components/ToolSearch';
import soilPhTester from '../assets/ph.png';
import moisture from '../assets/moisture.png';
import spray from '../assets/spray.png';
import tiller from '../assets/tiller.png';
import prune from '../assets/prune.png';
import tray from '../assets/tray.png';
import hoe from '../assets/hoe.png';
import chaff from '../assets/chaff.png';
import knap from '../assets/knap.png';
import trim from '../assets/trim.png';
import cow from '../assets/cow.png';
import vermi from '../assets/vermi.png';
import green from '../assets/green.png';
import bin from '../assets/bin.png';
import pre from '../assets/pre.png';

const featuredProducts = [
  {
    name: 'Soil pH Tester Kit',
    image: soilPhTester,
    link: 'https://www.amazon.in/s?k=ph%2Bsensor%2Bfor%2Brice%2Bfarming&tag=yourtag-21',
  },
  {
    name: 'Digital Moisture Meter',
    image: moisture,
    link: 'https://www.amazon.in/s?k=Digital%2BMoisture%2BMeter&tag=yourtag-21',
  },
  {
    name: 'Battery Sprayer',
    image: spray,
    link: 'https://www.amazon.in/s?k=Battery%2BSprayer&tag=yourtag-211',
  },
  {
    name: 'Hand Tiller Tool',
    image: tiller,
    link: 'https://www.amazon.in/s?k=Hand%2BTiller%2BTool&tag=yourtag-21',
  },
  {
    name: 'Garden Pruner Shears',
    image: prune,
    link: 'https://www.amazon.in/s?k=Garden%2BPruner%2BShears&tag=yourtag-21',
  },
  {
    name: 'Seedling Tray (98 Cavities)',
    image: tray,
    link: 'https://www.amazon.in/s?k=Seedling%2BTray%2B%2898%2BCavities%29&tag=yourtag-21',
  },
  {
    name: 'Garden Hoe with Wooden Handle',
    image: hoe,
    link: 'https://www.amazon.in/s?k=Garden%2BHoe%2Bwith%2BWooden%2BHandle&tag=yourtag-21',
  },
  {
    name: 'Electric Chaff Cutter',
    image: chaff,
    link: 'https://www.amazon.in/s?k=Electric%2BChaff%2BCutter&tag=yourtag-21',
  },
  {
    name: 'KnapSack Sprayer',
    image: knap,
    link: 'https://www.amazon.in/s?k=KnapSack%2BSprayer&tag=yourtag-21',
  },
  {
    name: 'Irrigation Timer',
    image: trim,
    link: 'https://www.amazon.in/s?k=Irrigation%2BTimer&tag=yourtag-21',
  },
  {
    name: 'Cow Dung Manure - 5Kg',
    image: cow,
    link: 'https://www.amazon.in/s?k=Cow%2BDung%2BManure%2B-%2B5Kg&tag=yourtag-21',
  },
  {
    name: 'Vermicompost Fertilizer',
    image: vermi,
    link: 'https://www.amazon.in/s?k=Vermicompost%2BFertilizer&tag=yourtag-21',
  },
  {
    name: 'Mini Greenhouse Tent',
    image: green,
    link: 'https://www.amazon.in/s?k=Mini%2BGreenhouse%2BTent&tag=yourtag-21',
  },
  {
    name: 'Compost Bin Kit',
    image: bin,
    link: 'https://www.amazon.in/s?k=Compost%2BBin%2BKit&tag=yourtag-21',
  },
  {
    name: 'Agri Spray Nozzle Set',
    image: pre,
    link: 'https://www.amazon.in/s?k=Agri%2BSpray%2BNozzle%2BSet&tag=yourtag-21',
  },
];

const AgroMarket = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-center text-green-800">Agro Market</h1>
      <p className="text-center mb-6 text-gray-700">
        Enter the type of tool you're looking for, and we'll recommend tools with links!
      </p>
      <ToolSearch />

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-green-700">Featured Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {featuredProducts.map((product, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition duration-300"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-contain bg-white p-2"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Buy on Amazon
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgroMarket;
