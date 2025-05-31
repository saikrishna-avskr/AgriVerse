import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar";

// DiseaseDetectionPage: Allows users to upload a crop image and get disease prediction
export default function DiseaseDetectionPage() {
  // State for the uploaded image file
  const [image, setImage] = useState(null);
  // State for the prediction result from backend
  const [result, setResult] = useState(null);
  // State to show loading spinner while processing
  const [loading, setLoading] = useState(false);
  // State for error messages
  const [error, setError] = useState(null);

  // Handle form submission: send image and language to backend for prediction
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner
    setError(null); // Clear previous errors
    setResult(null); // Clear previous result

    // Prepare form data with image and language
    const formData = new FormData();
    formData.append("image", image);
    formData.append("Language", e.target.Language.value);

    try {
      // Send POST request to backend API
      const response = await fetch(
        "http://127.0.0.1:8000/api/predict-disease/",
        {
          method: "POST",
          body: formData,
        }
      );

      // If response is not OK, throw error
      if (!response.ok) throw new Error("Failed to get prediction.");

      // Parse JSON response and update result state
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message); // Show error message
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center py-8 px-4">
      {/* Top navigation bar */}
      <Navbar />
      <br />
      {/* Page title */}
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">
        Crop Disease Detection
      </h1>
      {/* Image upload and language selection form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl space-y-4"
      >
        {/* Image file input */}
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
        {/* Language input */}
        <label htmlFor="Language">Language:</label>&nbsp;
        <input
          type="text"
          name="Language"
          id="Language"
          placeholder=" eg..English(default)"
          className="border border-black"
        />
        <br />
        {/* Mode dropdown */}
        <label htmlFor="mode" className="block text-emerald-800 font-semibold mb-2">
          Mode:
        </label>
        <select
          id="mode"
          name="mode"
          className="block w-full border border-emerald-200 rounded-xl px-3 py-2 bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-2"
        >
          <option value="model">model</option>
          <option value="gemini">gemini</option>
        </select>
        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl mt-2"
          disabled={loading}
        >
          {loading ? "Processing..." : "Detect Disease"}
        </button>
      </form>

      {/* Error message display */}
      {error && (
        <div className="mt-4 text-red-600 font-semibold text-center">
          {error}
        </div>
      )}

      {/* Prediction result display */}
      {result && (
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl">
          <h2 className="text-xl font-bold text-emerald-700 mb-2">
            Prediction Result
          </h2>
          {/* Show uploaded image at center if available */}
          {result.image && (
            <img
              src={`data:image/jpeg;base64,${result.image}`}
              alt="Uploaded leaf"
              className="mb-4 max-h-64 rounded-xl border "
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
          )}
          {/* Show prediction result using markdown */}
          <div className="prose max-w-none">
            <ReactMarkdown>{result.result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
