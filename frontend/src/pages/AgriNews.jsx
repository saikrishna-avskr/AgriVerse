import React, { useState } from "react";
import heroImage from "../assets/news1.jpg"; // Background image for the news page

// AgriNews component: Fetches and displays agriculture news and reputable sources
const AgriNews = () => {
  // State variables for user input, language, news summary, reputable links, error, and loading status
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("english");
  const [news, setNews] = useState("");
  const [links, setLinks] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handles form submission to fetch news from backend API
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);    // Show loading state
    setError("");        // Reset error
    setNews("");         // Reset news
    setLinks("");        // Reset links
    try {
      // Send POST request to backend with query and language
      const response = await fetch("http://127.0.0.1:8000/api/agri-news/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ news_query: query, language }),
      });
      const data = await response.json();
      // If successful, update news and links; else show error
      if (data.success) {
        setNews(data.news_summary || "");
        setLinks(data.reputable_sources || "");
      } else {
        setError(data.error || "Failed to fetch news.");
      }
    } catch (err) {
      setError("Failed to fetch news." + err.message);
    }
    setLoading(false); // Hide loading state
  };

  return (
    // Main container with background image and overlay
    <div className="relative min-h-screen">
      {/* Background image, fixed and faded */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
      {/* Main Content Overlay */}
      <div className="relative z-10 min-h-screen bg-emerald-50 bg-opacity-80">
        {/* === Hero Section === */}
        <div className="w-full flex items-center justify-center py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 bg-white bg-opacity-60 px-6 py-2 rounded-xl shadow-lg">
            🌾 Agri News Hub
          </h1>
        </div>

        {/* === Form Section === */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* News Query Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Input for news topic */}
            <input
              className="p-3 border border-gray-300 rounded-xl focus:ring-emerald-400 focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter news topic..."
            />
            {/* Input for language */}
            <input
              className="p-3 border border-gray-300 rounded-xl focus:ring-emerald-400 focus:outline-none"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="Enter language (e.g., english)"
            />
            {/* Submit button */}
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200"
              disabled={loading}
            >
              {loading ? "Loading..." : "Get News"}
            </button>
          </form>

          {/* === Output Section Split === */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Insights (news summary) */}
            <div className="md:w-3/5 bg-white p-6 rounded-3xl shadow-xl">
              <h2 className="text-2xl font-bold text-emerald-700 mb-4">🧠 Insights</h2>
              {news ? (
                // Render news summary as HTML
                <div
                  className="prose prose-lg max-w-none text-gray-800"
                  dangerouslySetInnerHTML={{ __html: news }}
                />
              ) : (
                <p className="text-gray-500">Enter a topic and language to get insights here.</p>
              )}
            </div>

            {/* Right: Links (reputable sources) */}
            <div className="md:w-2/5 bg-white p-6 rounded-3xl shadow-xl">
              <h2 className="text-2xl font-bold text-emerald-700 mb-4">🔗 Reputable News Sources</h2>
              {links ? (
                // Render reputable sources as HTML
                <div
                  className="prose max-w-none text-emerald-600"
                  dangerouslySetInnerHTML={{ __html: links }}
                />
              ) : (
                <p className="text-gray-500">No reputable sources found yet.</p>
              )}
            </div>
          </div>

          {/* === Error Message === */}
          {error && (
            <div className="mt-6 text-red-600 font-semibold text-center">
              {/* Display error if any */}
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgriNews;
