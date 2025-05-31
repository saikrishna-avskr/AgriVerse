import React, { useState } from "react";
import HomeGrowerGuidanceForm from "../components/HomeGrowerGuidanceForm";
import SuccessStories from "../components/SuccessStories";
import hgui1 from "../assets/hgui1.png";
import hgui2 from "../assets/hgui2.png";
import hgui3 from "../assets/hgui3.png";

// Helper: Generate an Amazon affiliate link for a given tool/item name
const affiliateLink = (toolName) => {
  const query = encodeURIComponent(toolName);
  return `https://www.amazon.in/s?k=${query}`;
};

// Helper: Convert [item] in text to clickable affiliate links
const convertToAffiliateLinks = (text) => {
  return text.replace(/\[([^\]]+)\]/g, (_, item) => {
    const url = affiliateLink(item);
    return `<a href="${url}" target="_blank" class="text-green-700 underline hover:text-green-900">${item}</a>`;
  });
};

const Terrace = () => {
  // State for showing/hiding the home grower form
  const [showForm, setShowForm] = useState(false);
  // State for selected DIY and smart gardening options
  const [diyOption, setDiyOption] = useState("");
  const [diyResponse, setDiyResponse] = useState("");
  const [smartOption, setSmartOption] = useState("");
  const [smartResponse, setSmartResponse] = useState("");

  // Gemini API key (should be stored securely in production)
  const GEMINI_API_KEY = "AIzaSyA9Ggk7lKD5X-9iNERVRedeT3MH7_XKjbs";

  // Function to generate step-by-step implementation for a gardening idea
  const generateImplementation = async (idea, type) => {
    // Prompt for Gemini API: asks for plain, step-by-step instructions
    const prompt = `
You are an expert gardening assistant.

Give a clear, step-by-step implementation plan for the idea: "${idea}" suitable for a home grower. Make it concise, practical, and valuable.

❗ Do not use markdown formatting (no **bold**, no *italics*, no special characters). 
❗ Output should be in plain text only. 
✅ If you mention any tools, items, or materials that the user might need to buy (e.g., flower pots, seeds, compost bin, irrigation kits), enclose them in square brackets like [flower pots].

Return the response as plain, numbered steps or concise instructions. No need for decoration—just helpful, structured guidance.
`;

    // Call Gemini API with the prompt
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    // Parse the response and update the appropriate state
    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
    type === "diy" ? setDiyResponse(text) : setSmartResponse(text);
  };

  return (
    <div className="bg-gradient-to-b from-green-100 to-emerald-200 min-h-screen p-6 md:p-12">
      {/* Page Title */}
      <h2 className="text-4xl font-bold text-center text-emerald-800 mb-10 drop-shadow-sm">
        🌿 HomeGrower's Paradise: Terrace Gardening Guide
      </h2>

      {/* Getting Started Section */}
      <div className="mb-10 bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-md">
        <h3 className="text-2xl font-semibold text-emerald-700 mb-4">
          🌱 Getting Started with Your Home Garden
        </h3>
        <p className="text-gray-700 text-lg">
          Whether you're working with a rooftop, balcony, or backyard, home
          gardening begins with proper planning. Use lightweight containers,
          nutrient-rich potting mix, and ensure your space receives adequate
          sunlight and drainage.
        </p>
      </div>

      {/* DIY Techniques Section */}
      <section className="mb-10 bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-md">
        <h3 className="text-2xl font-semibold text-emerald-700 mb-4">
          🛠️ DIY Gardening Techniques
        </h3>
        <ul className="list-disc list-inside text-gray-700 text-lg space-y-2 mb-4">
          <li>Create vertical gardens using recycled bottles or wooden palettes</li>
          <li>Turn your kitchen waste into compost for natural plant nutrition</li>
          <li>Design a budget-friendly drip irrigation system with bottles</li>
        </ul>

        {/* Dropdown to select a DIY idea */}
        <label className="block text-emerald-800 font-medium mb-2">
          Select an idea to get implementation guidance:
        </label>
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
          <option value="vertical gardens using recycled bottles or wooden palettes">
            Vertical gardens using recycled bottles or wooden palettes
          </option>
          <option value="kitchen waste into compost for natural plant nutrition">
            Kitchen waste into compost
          </option>
          <option value="budget-friendly drip irrigation system with bottles">
            Drip irrigation with bottles
          </option>
          <option value="custom">Your own idea</option>
        </select>

        {/* Custom DIY idea input */}
        {diyOption === "custom" && (
          <input
            type="text"
            placeholder="Describe your own DIY gardening idea..."
            className="w-full border rounded-lg px-4 py-2 mb-4"
            onChange={() => setDiyResponse("")}
            onBlur={(e) => generateImplementation(e.target.value, "diy")}
          />
        )}

        {/* Show DIY response with affiliate links */}
        {diyResponse && (
          <div
            className="bg-emerald-50 p-4 rounded-lg shadow text-gray-800 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: convertToAffiliateLinks(diyResponse),
            }}
          />
        )}
      </section>

      {/* Smart Gardening Tips Section */}
      <section className="mb-10 bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-md">
        <h3 className="text-2xl font-semibold text-emerald-700 mb-4">
          ♻️ Sustainable & Smart Gardening Tips
        </h3>
        <p className="text-gray-700 text-lg mb-4">
          Incorporate eco-friendly practices like rainwater harvesting, growing
          native plants, and minimizing pesticide use to make your garden both
          lush and sustainable.
        </p>

        {/* Dropdown to select a sustainability tip */}
        <label className="block text-emerald-800 font-medium mb-2">
          Select a sustainable idea to get implementation guidance:
        </label>
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

        {/* Custom sustainability idea input */}
        {smartOption === "custom" && (
          <input
            type="text"
            placeholder="Describe your sustainable gardening idea..."
            className="w-full border rounded-lg px-4 py-2 mb-4"
            onChange={() => setSmartResponse("")}
            onBlur={(e) => generateImplementation(e.target.value, "smart")}
          />
        )}

        {/* Show smart gardening response with affiliate links */}
        {smartResponse && (
          <div
            className="bg-emerald-50 p-4 rounded-lg shadow text-gray-800 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: convertToAffiliateLinks(smartResponse),
            }}
          />
        )}
      </section>

      {/* Success Stories Section */}
      <SuccessStories />

      {/* Button to show/hide the home grower guidance form */}
      <div className="text-center mb-10">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 text-white text-lg font-semibold py-3 px-6 rounded-full shadow-md"
        >
          {showForm ? "Hide Form" : "🌸 I'm a HomeGrower – Get Guidance"}
        </button>
      </div>

      {/* Conditional rendering of the home grower guidance form */}
      {showForm && (
        <div className="mt-4 mb-10">
          <HomeGrowerGuidanceForm />
        </div>
      )}

      {/* Decorative images at the bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
        {[hgui1, hgui2, hgui3].map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Gardening Visual ${i + 1}`}
            className="w-full rounded-2xl shadow-md object-cover h-60"
          />
        ))}
      </div>
    </div>
  );
};

export default Terrace;
