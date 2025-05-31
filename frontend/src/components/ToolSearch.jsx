import React, { useState } from 'react';

// ToolSearch component allows users to search for farming tools and get product links
const ToolSearch = () => {
  // State to store user input
  const [input, setInput] = useState('');
  // State to store generated Amazon and Flipkart links
  const [links, setLinks] = useState(null);
  // State to indicate loading status
  const [loading, setLoading] = useState(false);

  // Function to fetch product keywords and generate shopping links
  const getLinks = async () => {
    setLoading(true); // Start loading
    // Create prompt for the generative API
    const prompt = `A farmer needs: "${input}". Suggest relevant product keywords to search on Amazon or Flipkart.`;
    // Call the Gemini API to get product keywords
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_GEMINI_API_KEY`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await res.json();
    // Extract keywords from API response, fallback to user input if not found
    const keywords = data?.candidates?.[0]?.content?.parts?.[0]?.text || input;
    // Encode keywords for URL query
    const query = encodeURIComponent(keywords.replace(/\s+/g, '+'));

    // Set Amazon and Flipkart search links with affiliate tags
    setLinks({
      amazon: `https://www.amazon.in/s?k=${query}&tag=yourtag-21`,
      flipkart: `https://www.flipkart.com/search?q=${query}&affid=youraffid`,
    });
    setLoading(false); // Stop loading
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Input field for user to enter tool or requirement */}
      <input
        type="text"
        value={input}
        placeholder="e.g., pH sensor for rice farming"
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 rounded"
      />
      {/* Button to trigger product recommendation */}
      <button
        onClick={getLinks}
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Get Recommendations'}
      </button>

      {/* Display generated shopping links if available */}
      {links && (
        <div className="mt-4">
          <a href={links.amazon} target="_blank" className="text-blue-600 block mb-2" rel="noopener noreferrer">
            🔗 Buy on Amazon
          </a>
          <a href={links.flipkart} target="_blank" className="text-blue-600" rel="noopener noreferrer">
            🔗 Buy on Flipkart
          </a>
        </div>
      )}
    </div>
  );
};

export default ToolSearch;
