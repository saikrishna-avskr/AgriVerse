import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function HomeGrowerGuidanceForm() {
  const [formData, setFormData] = useState({
    location: "",
    space_type: "",
    space_size: "",
    sunlight: "",
    containers: "",
    soil_type: "",
    water_availability: "",
    temperature: "",
    humidity: "",
    effort_level: "",
    preferred_plants: "",
    experience: "",
    language: "",
  });

  const [result, setResult] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("Loading...");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/home_garden_guidance/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      setResult(data.guidance || "No result returned.");
    } catch (error) {
      setResult("Error occurred while fetching guidance.");
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">
        Grow-at-Home Guidance Form
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-4xl space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="p-2 border rounded-xl"
            name="location"
            placeholder="Your City or Region"
            onChange={handleChange}
            value={formData.location}
          />

          <select
            className="p-2 border rounded-xl"
            name="space_type"
            onChange={handleChange}
            value={formData.space_type}
          >
            <option value="">Type of Space</option>
            <option>Rooftop</option>
            <option>Balcony</option>
            <option>Backyard</option>
            <option>Indoor</option>
            <option>Greenhouse</option>
          </select>

          <input
            className="p-2 border rounded-xl"
            name="space_size"
            placeholder="Approximate Space Size (e.g., 5x5 ft)"
            onChange={handleChange}
            value={formData.space_size}
          />
          <input
            className="p-2 border rounded-xl"
            name="sunlight"
            placeholder="Sunlight Hours per Day (e.g., 4-6 hrs)"
            onChange={handleChange}
            value={formData.sunlight}
          />

          <input
            className="p-2 border rounded-xl"
            name="containers"
            placeholder="Type of Containers (e.g., pots, raised beds)"
            onChange={handleChange}
            value={formData.containers}
          />

          <select
            className="p-2 border rounded-xl"
            name="soil_type"
            onChange={handleChange}
            value={formData.soil_type}
          >
            <option value="">Soil Type</option>
            <option>Potting Mix</option>
            <option>Loamy</option>
            <option>Sandy</option>
            <option>Compost-enriched</option>
            <option>Clay</option>
          </select>

          <select
            className="p-2 border rounded-xl"
            name="water_availability"
            onChange={handleChange}
            value={formData.water_availability}
          >
            <option value="">Water Availability</option>
            <option>Daily</option>
            <option>Alternate Days</option>
            <option>Limited</option>
          </select>

          <input
            className="p-2 border rounded-xl"
            name="temperature"
            placeholder="Usual Temperature Range (e.g., 20-35°C)"
            onChange={handleChange}
            value={formData.temperature}
          />
          <input
            className="p-2 border rounded-xl"
            name="humidity"
            placeholder="Humidity Level % (optional)"
            onChange={handleChange}
            value={formData.humidity}
          />

          <select
            className="p-2 border rounded-xl"
            name="effort_level"
            onChange={handleChange}
            value={formData.effort_level}
          >
            <option value="">Effort You Can Put In</option>
            <option>Minimal</option>
            <option>Moderate</option>
            <option>High</option>
          </select>

          <input
            className="p-2 border rounded-xl"
            name="preferred_plants"
            placeholder="Any Preferred Plants (e.g., Tomatoes, Herbs)"
            onChange={handleChange}
            value={formData.preferred_plants}
          />

          <select
            className="p-2 border rounded-xl"
            name="experience"
            onChange={handleChange}
            value={formData.experience}
          >
            <option value="">Gardening Experience</option>
            <option>None</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Expert</option>
          </select>
          <input
            className="p-2 border rounded-xl"
            name="language"
            placeholder="Language (e.g., English(default))"
            onChange={handleChange}
            value={formData.language}
          />
        </div>

        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl w-full mt-4"
        >
          Get Home Gardening Advice
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-md w-full max-w-4xl">
          <h2 className="text-xl font-bold text-emerald-700 mb-2">
            Suggested Plants & Tips:
          </h2>
          <div className="prose max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
