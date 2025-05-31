import React, { useState } from "react";

// Helper function to generate an Amazon affiliate search link for a given tool/item name
const affiliateLink = (toolName) => {
  const query = encodeURIComponent(toolName);
  return `https://www.amazon.in/s?k=${query}`;
};

// Converts [tool/item] mentions in text to clickable affiliate links
const convertToAffiliateLinks = (text) => {
  return text.replace(/\[([^\]]+)\]/g, (_, item) => {
    const url = affiliateLink(item);
    return `<a href="${url}" target="_blank" class="text-blue-600 underline hover:text-blue-800">${item}</a>`;
  });
};

const SuccessStories = () => {
  // State to hold fetched stories text
  const [stories, setStories] = useState("");
  // State to indicate loading status
  const [loading, setLoading] = useState(false);

  // Gemini API key (should be stored securely in production)
  const GEMINI_API_KEY = "AIzaSyA9Ggk7lKD5X-9iNERVRedeT3MH7_XKjbs"; // Replace with environment variable in prod

  // Fetches motivational success stories from Gemini API
  const fetchSuccessStories = async () => {
    setLoading(true);
    // Prompt for the AI model to generate stories
    const prompt = `Share 3 short, motivational success stories of Indian home gardeners who transformed their small spaces into lush green gardens. Each story should be concise (4-5 lines), practical, and inspiring. Mention specific tools or items they used in square brackets like [grow bags], [vermicompost], [vertical rack]. Return plain text only.`;

    try {
      // Make POST request to Gemini API
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

      // Parse response and extract generated text
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
      setStories(text);
    } catch (err) {
      // Handle errors gracefully
      console.error("Failed to fetch success stories", err);
      setStories("An error occurred while fetching stories.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-10 bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-md">
      <h3 className="text-2xl font-semibold text-green-700 mb-4">🌟 Real Growers, Real Stories</h3>
      <p className="text-gray-700 text-lg mb-4">
        Get inspired by passionate home gardeners from across India who've turned their homes into green havens.
      </p>
      {/* Button to trigger fetching of stories */}
      <div className="text-center mb-4">
        <button
          onClick={fetchSuccessStories}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition"
          disabled={loading}
        >
          {loading ? "Loading..." : "🌱 Show Me Their Stories"}
        </button>
      </div>
      {/* Display fetched stories with affiliate links, preserving formatting */}
      {stories && (
        <div
          className="bg-green-50 p-4 rounded-lg shadow text-gray-800 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: convertToAffiliateLinks(stories) }}
        />
      )}
    </section>
  );
};

export default SuccessStories;
