import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

// CropGuidanceForm: Main component for the AI Crop Guidance form
export default function CropGuidanceForm() {
  // State to hold all form input values
  const [formData, setFormData] = useState({
    region: "",
    latlong: "",
    soil_type: "",
    soil_ph: "",
    moisture: "",
    npk: "",
    season: "",
    rainfall: "",
    temperature: "",
    humidity: "",
    sunlight: "",
    previous_crop: "",
    harvest_date: "",
    irrigation: "",
    fertilizer: "",
    equipment: "",
    crop_type: "",
    market: "",
    land_size: "",
  });

  // State to hold the result returned from the API
  const [result, setResult] = useState("");

  // Handle input changes and update formData state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission: send data to backend and update result
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("Loading...");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/crop-guidance/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data.guidance || "No result returned.");
    } catch (error) {
      setResult("Error occurred while fetching guidance.");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center py-8 px-4">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        AI Crop Guidance Form
      </h1>
      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-4xl space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Region/Location Inputs */}
          <input
            className="p-2 border rounded-xl"
            name="region"
            placeholder="Region/State/Country"
            onChange={handleChange}
            value={formData.region}
          />
          <input
            className="p-2 border rounded-xl"
            name="latlong"
            placeholder="Latitude, Longitude (optional)"
            onChange={handleChange}
            value={formData.latlong}
          />

          {/* Soil Type Selection */}
          <select
            className="p-2 border rounded-xl"
            name="soil_type"
            onChange={handleChange}
            value={formData.soil_type}
          >
            <option value="">Select Soil Type</option>
            <option>Loamy</option>
            <option>Sandy</option>
            <option>Clay</option>
            <option>Silty</option>
            <option>Peaty</option>
            <option>Saline</option>
          </select>
          {/* Soil pH Input */}
          <input
            className="p-2 border rounded-xl"
            name="soil_ph"
            placeholder="Soil pH (e.g., 6.5)"
            onChange={handleChange}
            value={formData.soil_ph}
          />

          {/* Soil Moisture and NPK Inputs */}
          <input
            className="p-2 border rounded-xl"
            name="moisture"
            placeholder="Soil Moisture % (optional)"
            onChange={handleChange}
            value={formData.moisture}
          />
          <input
            className="p-2 border rounded-xl"
            name="npk"
            placeholder="NPK Levels (e.g., N20 P10 K10)"
            onChange={handleChange}
            value={formData.npk}
          />

          {/* Season and Rainfall Selection */}
          <select
            className="p-2 border rounded-xl"
            name="season"
            onChange={handleChange}
            value={formData.season}
          >
            <option value="">Select Season</option>
            <option>Kharif</option>
            <option>Rabi</option>
            <option>Zaid</option>
          </select>
          <select
            className="p-2 border rounded-xl"
            name="rainfall"
            onChange={handleChange}
            value={formData.rainfall}
          >
            <option value="">Rainfall Pattern</option>
            <option>Low</option>
            <option>Moderate</option>
            <option>Heavy</option>
          </select>

          {/* Temperature and Humidity Inputs */}
          <input
            className="p-2 border rounded-xl"
            name="temperature"
            placeholder="Temperature Range (e.g., 25-35°C)"
            onChange={handleChange}
            value={formData.temperature}
          />
          <input
            className="p-2 border rounded-xl"
            name="humidity"
            placeholder="Humidity %"
            onChange={handleChange}
            value={formData.humidity}
          />

          {/* Sunlight Input */}
          <input
            className="p-2 border rounded-xl"
            name="sunlight"
            placeholder="Sunlight (hrs/day) (optional)"
            onChange={handleChange}
            value={formData.sunlight}
          />

          {/* Previous Crop and Harvest Date Inputs */}
          <input
            className="p-2 border rounded-xl"
            name="previous_crop"
            placeholder="Previous Crop Grown"
            onChange={handleChange}
            value={formData.previous_crop}
          />
          <input
            className="p-2 border rounded-xl"
            type="date"
            name="harvest_date"
            placeholder="Harvest Date"
            onChange={handleChange}
            value={formData.harvest_date}
          />

          {/* Irrigation Type Selection */}
          <select
            className="p-2 border rounded-xl"
            name="irrigation"
            onChange={handleChange}
            value={formData.irrigation}
          >
            <option value="">Select Irrigation Type</option>
            <option>Drip</option>
            <option>Sprinkler</option>
            <option>Canal</option>
            <option>Rainfed</option>
          </select>
          {/* Fertilizer Input */}
          <input
            className="p-2 border rounded-xl"
            name="fertilizer"
            placeholder="Fertilizers Available"
            onChange={handleChange}
            value={formData.fertilizer}
          />

          {/* Equipment, Crop Type, Market, and Land Size Inputs */}
          <input
            className="p-2 border rounded-xl"
            name="equipment"
            placeholder="Equipment Access (optional)"
            onChange={handleChange}
            value={formData.equipment}
          />
          <input
            className="p-2 border rounded-xl"
            name="crop_type"
            placeholder="Preferred Crop Type"
            onChange={handleChange}
            value={formData.crop_type}
          />

          <input
            className="p-2 border rounded-xl"
            name="market"
            placeholder="Market Demand / Sale Value"
            onChange={handleChange}
            value={formData.market}
          />
          <input
            className="p-2 border rounded-xl"
            name="land_size"
            placeholder="Land Size (e.g., 2 acres)"
            onChange={handleChange}
            value={formData.land_size}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl w-full mt-4"
        >
          Get Guidance
        </button>
      </form>

      {/* Display AI Guidance Result */}
      {result && (
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-md w-full max-w-4xl">
          <h2 className="text-xl font-bold text-green-700 mb-2">
            AI Guidance Result:
          </h2>
          <div className="prose max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
