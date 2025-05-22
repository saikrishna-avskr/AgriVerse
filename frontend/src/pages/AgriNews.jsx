import React, { useState } from "react";

const AgriNews = () => {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("english");
  const [news, setNews] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNews("");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/agri-news/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          news_query: query,
          language: language,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setNews(data.news_summary);
      } else {
        setError(data.error || "Failed to fetch news.");
      }
    } catch (err) {
      setError("Failed to fetch news.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">Agri News</h1>
      <form onSubmit={handleSubmit} className="mb-6 w-full max-w-md">
        <div className="flex flex-col gap-4">
          <input
            className="p-2 border rounded-xl"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter news topic"
          />
          <input
            className="p-2 border rounded-xl"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="Enter language (e.g., english, hindi, spanish)"
          />
          <button
            type="submit"
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl w-full"
            disabled={loading}
          >
            {loading ? "Loading..." : "Get News"}
          </button>
        </div>
      </form>
      {news && (
        <div
          className="bg-white p-6 rounded-2xl shadow-md w-full max-w-3xl prose"
          dangerouslySetInnerHTML={{ __html: news }}
        />
      )}
      {error && <div className="text-red-600 font-semibold">{error}</div>}
    </div>
  );
};

export default AgriNews;
