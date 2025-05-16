import { useState } from "react";

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
        console.log(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          Crop Disease Detection
        </h1>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="block w-full mb-4 border rounded px-3 py-2"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {error && <div className="mt-4 text-red-600 font-semibold">{error}</div>}

      {result && (
        <div className="mt-6 bg-white p-4 rounded shadow-md w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2 text-green-700">
            Prediction Result
          </h2>
          {/* <p>
            <strong>Disease:</strong> {result.disease}
                  </p>
                  
          <p className="mt-2">
            <strong>Solution:</strong> {result.solution}
          </p> */}
          <p>{result.result}</p>
        </div>
      )}
    </div>
  );
}
