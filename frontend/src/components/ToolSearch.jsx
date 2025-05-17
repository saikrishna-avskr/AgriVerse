import React, { useState } from 'react';

const ToolSearch = () => {
  const [input, setInput] = useState('');
  const [links, setLinks] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLinks = async () => {
    setLoading(true);
    const prompt = `A farmer needs: "${input}". Suggest relevant product keywords to search on Amazon or Flipkart.`;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_GEMINI_API_KEY`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await res.json();
    const keywords = data?.candidates?.[0]?.content?.parts?.[0]?.text || input;
    const query = encodeURIComponent(keywords.replace(/\s+/g, '+'));

    setLinks({
      amazon: `https://www.amazon.in/s?k=${query}&tag=yourtag-21`,
      flipkart: `https://www.flipkart.com/search?q=${query}&affid=youraffid`,
    });
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        value={input}
        placeholder="e.g., pH sensor for rice farming"
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 rounded"
      />
      <button
        onClick={getLinks}
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Get Recommendations'}
      </button>

      {links && (
        <div className="mt-4">
          <a href={links.amazon} target="_blank" className="text-blue-600 block mb-2">
            🔗 Buy on Amazon
          </a>
          <a href={links.flipkart} target="_blank" className="text-blue-600">
            🔗 Buy on Flipkart
          </a>
        </div>
      )}
    </div>
  );
};

export default ToolSearch;
