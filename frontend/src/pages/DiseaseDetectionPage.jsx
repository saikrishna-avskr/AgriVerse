import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar";

export default function DiseaseDetectionPage() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("Language", e.target.Language.value);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/predict-disease/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to get prediction.");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center py-8 px-4">
      <Navbar/><br/>
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">
        Crop Disease Detection
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl space-y-4"
      >
        <label className="block text-emerald-800 font-semibold mb-2">
          Upload Crop Leaf Image
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="block w-full border border-emerald-200 rounded-xl px-3 py-2 bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          required
        />
        <label htmlFor="Language">Language:</label>&nbsp;
        <input type="text" name="Language" id="Language" placeholder=" eg..English(default)" className="border border-black"/>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl mt-2"
          disabled={loading}
        >
          {loading ? "Processing..." : "Detect Disease"}
        </button>
      </form>

      {error && (
        <div className="mt-4 text-red-600 font-semibold text-center">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl">
          <h2 className="text-xl font-bold text-emerald-700 mb-2">
            Prediction Result
          </h2>
          <div className="prose max-w-none">
            <ReactMarkdown>{result.result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
