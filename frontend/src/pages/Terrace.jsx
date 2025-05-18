import React, { useState } from "react";
import HomeGrowerGuidanceForm from "../components/HomeGrowerGuidanceForm";
import terraceImage1 from "../assets/ter1.jpg";
import terraceImage2 from "../assets/ter2.jpg";
import terraceImage3 from "../assets/ter3.png";
import SuccessStories from "../components/SuccessStories";

const affiliateLink = (toolName) => {
  const query = encodeURIComponent(toolName);
  return `https://www.amazon.in/s?k=${query}`;
};

const convertToAffiliateLinks = (text) => {
  return text.replace(/\[([^\]]+)\]/g, (_, item) => {
    const url = affiliateLink(item);
    return `<a href="${url}" target="_blank" class="text-blue-600 underline hover:text-blue-800">${item}</a>`;
  });
};

const Terrace = () => {
  const [showForm, setShowForm] = useState(false);
  const [diyOption, setDiyOption] = useState("");
  const [diyResponse, setDiyResponse] = useState("");
  const [smartOption, setSmartOption] = useState("");
  const [smartResponse, setSmartResponse] = useState("");

  const GEMINI_API_KEY = "AIzaSyA9Ggk7lKD5X-9iNERVRedeT3MH7_XKjbs"; // Replace with env var in production

 const generateImplementation = async (idea, type) => {
  const prompt = `
  You are an expert gardening assistant.

  Give a clear, step-by-step implementation plan for the idea: "${idea}" suitable for a home grower. Make it concise, practical, and valuable.

  ❗ Do not use markdown formatting (no **bold**, no *italics*, no special characters). 
  ❗ Output should be in plain text only. 
  ✅ If you mention any tools, items, or materials that the user might need to buy (e.g., flower pots, seeds, compost bin, irrigation kits), enclose them in square brackets like [flower pots].

  Return the response as plain, numbered steps or concise instructions. No need for decoration—just helpful, structured guidance.
  `;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
  type === "diy" ? setDiyResponse(text) : setSmartResponse(text);
};


  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen p-6 md:p-12">
      <h2 className="text-4xl font-bold text-center text-green-800 mb-10 drop-shadow-md">
        🌿 HomeGrower's Paradise: Terrace Gardening Guide
      </h2>

      {/* Hero Image */}
      <div className="rounded-3xl overflow-hidden shadow-lg mb-10">
        <img src={terraceImage1} alt="Terrace Garden" className="w-full h-80 object-cover" />
      </div>

      {/* Getting Started + Image */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-10 bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-md">
        <div>
          <h3 className="text-2xl font-semibold text-green-700 mb-4">🌱 Getting Started with Your Home Garden</h3>
          <p className="text-gray-700 text-lg">
            Whether you're working with a rooftop, balcony, or backyard, home gardening begins with proper planning.
            Use lightweight containers, nutrient-rich potting mix, and ensure your space receives adequate sunlight and drainage.
          </p>
        </div>
        <img src={terraceImage2} alt="Terrace Garden" className="w-full h-64 object-cover rounded-xl shadow" />
      </div>

      {/* DIY Techniques */}
      <section className="mb-10 bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-md">
        <h3 className="text-2xl font-semibold text-green-700 mb-4">🛠️ DIY Gardening Techniques</h3>
        <ul className="list-disc list-inside text-gray-700 text-lg space-y-2 mb-4">
          <li>Create vertical gardens using recycled bottles or wooden palettes</li>
          <li>Turn your kitchen waste into compost for natural plant nutrition</li>
          <li>Design a budget-friendly drip irrigation system with bottles</li>
        </ul>

      <label className="block text-green-800 font-medium mb-2">Select an idea to get implementation guidance:</label>
<select
  className="w-full border rounded-lg px-4 py-2 mb-4"
  value={diyOption}
  onChange={(e) => {
    const val = e.target.value;
    setDiyOption(val);
    if (val !== "custom") generateImplementation(val, "diy");
  }}
>
  <option value="">-- Select a DIY Technique --</option>
  <option value="vertical gardens using recycled bottles or wooden palettes">Vertical gardens using recycled bottles or wooden palettes</option>
  <option value="kitchen waste into compost for natural plant nutrition">Kitchen waste into compost</option>
  <option value="budget-friendly drip irrigation system with bottles">Drip irrigation with bottles</option>
  <option value="custom">Your own idea</option>
</select>

{diyOption === "custom" && (
  <div className="mb-4">
    <input
      type="text"
      placeholder="Describe your own DIY gardening idea..."
      className="w-full border rounded-lg px-4 py-2"
      onChange={(e) => setDiyResponse("")}
      onBlur={(e) => generateImplementation(e.target.value, "diy")}
    />
  </div>
)}

{diyResponse && (
  <div
    className="bg-green-50 p-4 rounded-lg shadow text-gray-800 whitespace-pre-wrap"
    dangerouslySetInnerHTML={{ __html: convertToAffiliateLinks(diyResponse) }}
  />
)}

      </section>

      {/* Real Growers + Image */}
   


      {/* Smart Tips */}
      <section className="mb-10 bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-md">
        <h3 className="text-2xl font-semibold text-green-700 mb-4">♻️ Sustainable & Smart Gardening Tips</h3>
        <p className="text-gray-700 text-lg mb-4">
          Incorporate eco-friendly practices like rainwater harvesting, growing native plants, and minimizing pesticide use to make your garden both lush and sustainable.
        </p>

        <label className="block text-green-800 font-medium mb-2">Select a sustainable idea to get implementation guidance:</label>
<select
  className="w-full border rounded-lg px-4 py-2 mb-4"
  value={smartOption}
  onChange={(e) => {
    const val = e.target.value;
    setSmartOption(val);
    if (val !== "custom") generateImplementation(val, "smart");
  }}
>
  <option value="">-- Select a Sustainability Tip --</option>
  <option value="rainwater harvesting">Rainwater harvesting</option>
  <option value="growing native plants">Growing native plants</option>
  <option value="custom">Your own idea</option>
</select>

{smartOption === "custom" && (
  <div className="mb-4">
    <input
      type="text"
      placeholder="Describe your sustainable gardening idea..."
      className="w-full border rounded-lg px-4 py-2"
      onChange={(e) => setSmartResponse("")}
      onBlur={(e) => generateImplementation(e.target.value, "smart")}
    />
  </div>
)}

{smartResponse && (
  <div
    className="bg-green-50 p-4 rounded-lg shadow text-gray-800 whitespace-pre-wrap"
    dangerouslySetInnerHTML={{ __html: convertToAffiliateLinks(smartResponse) }}
  />
)}


      </section>
  <SuccessStories />
      {/* Form Trigger */}
      <div className="text-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 text-white text-lg font-semibold py-3 px-6 rounded-full shadow-md"
        >
          {showForm ? "Hide Form" : "🌸 I'm a HomeGrower – Get Guidance"}
        </button>
      </div>

      {/* Conditional Form */}
      {showForm && (
        <div className="mt-10">
          <HomeGrowerGuidanceForm />
        </div>
      )}
    </div>
  );
};

export default Terrace;
