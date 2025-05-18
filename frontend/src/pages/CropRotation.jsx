import React, { useState } from "react";

const CropRotation = () => {
  const [previousCrop, setPreviousCrop] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRecommendations("");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/crop-rotation/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previous_crop: previousCrop }),
      });
      const data = await response.json();
      setRecommendations(data.recommendations || "No recommendations found.");
    } catch {
      setRecommendations("Error fetching recommendations.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">Crop Rotation</h1>
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          className="p-2 border rounded-xl"
          value={previousCrop}
          onChange={(e) => setPreviousCrop(e.target.value)}
          placeholder="Previous Crop"
        />
        <button
          type="submit"
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl"
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Recommendations"}
        </button>
      </form>
      {recommendations && (
        <div
          className="bg-white p-6 rounded-2xl shadow-md w-full max-w-3xl prose"
          dangerouslySetInnerHTML={{ __html: recommendations }}
        />
      )}
    </div>
  );
};

export default CropRotation;