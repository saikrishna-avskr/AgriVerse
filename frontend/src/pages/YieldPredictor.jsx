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
        setResult(`${data.response_text}`);
      } else {
        setResult(data.error || "Prediction failed.");
      }
    } catch(error) {
      setResult("Prediction failed: "+ error.message);
    }
    setLoading(false);
  };

return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-emerald-50 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold text-emerald-800 mb-8 drop-shadow-md">
        🌾 Yield Predictor
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl border border-emerald-200 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(form).map(([key, value]) => (
            <div key={key}>
              <label className="block mb-1 text-emerald-800 font-medium capitalize">
                {key.replace(/_/g, " ")}
              </label>
              <input
                type={key.includes("Year") || key === "Area" || key === "Production" || key === "Annual_Rainfall" || key === "Fertilizer" || key === "Pesticide" ? "number" : "text"}
                name={key}
                value={value}
                onChange={handleChange}
                placeholder={`Enter ${key.replace(/_/g, " ")}`}
                className="w-full px-3 py-2 border border-emerald-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 ease-in-out shadow-lg"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Predicting...
            </>
          ) : (
            "🌱 Predict Yield"
          )}
        </button>
      </form>

      {result && (
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg w-full max-w-3xl text-center text-lg text-emerald-800 font-semibold border border-emerald-200">
          <p className="text-xl">📈 Prediction Result:</p>
          <p className="mt-2 italic">{result}</p>
        </div>
      )}
    </div>
  );
};

export default YieldPredictor;