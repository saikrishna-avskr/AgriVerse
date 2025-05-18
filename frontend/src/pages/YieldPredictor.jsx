import React, { useState } from "react";

const YieldPredictor = () => {
  const [form, setForm] = useState({
    Crop: "",
    Crop_Year: "",
    Season: "",
    State: "",
    Area: "",
    Production: "",
    Annual_Rainfall: "",
    Fertilizer: "",
    Pesticide: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/yield-predictor/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (data.success) {
        setResult(`Predicted Yield: ${data.predicted_yield}`);
      } else {
        setResult(data.error || "Prediction failed.");
      }
    } catch {
      setResult("Prediction failed.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">Yield Predictor</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl space-y-4">
        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            value={form[key]}
            onChange={handleChange}
            placeholder={key}
            className="block w-full border rounded-xl px-3 py-2 mb-2"
          />
        ))}
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl mt-2"
          disabled={loading}
        >
          {loading ? "Predicting..." : "Predict Yield"}
        </button>
      </form>
      {result && (
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl text-center text-lg text-emerald-700 font-bold">
          {result}
        </div>
      )}
    </div>
  );
};

export default YieldPredictor;