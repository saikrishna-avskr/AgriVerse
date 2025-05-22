import React, { useState } from "react";
import HomeGrowerGuidanceForm from "../components/HomeGrowerGuidanceForm"; 
import CropGuidanceForm from "../components/CropGuidanceForm";
import Navbar from "../components/Navbar";

export default function GuidancePage() {
  const [selection, setSelection] = useState("");

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center p-8">
      <Navbar />
      <br />
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        AI-Powered Crop & Garden Guidance
      </h1>

      {!selection && (
        <div className="grid gap-6 w-full max-w-2xl">
          <button
            onClick={() => setSelection("farmer")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-2xl shadow text-lg"
          >
            🌾 I'm a Farmer - Get Crop Guidance
          </button>

          <button
            onClick={() => setSelection("home")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-2xl shadow text-lg"
          >
            🏡 I'm a Home Grower - Get Plant Advice
          </button>
        </div>
      )}

      {selection === "farmer" && (
        <>
          <button
            className="text-sm text-blue-500 underline mt-4"
            onClick={() => setSelection("")}
          >
            ⬅ Back to selection
          </button>
          <CropGuidanceForm />
        </>
      )}

      {selection === "home" && (
        <>
          <button
            className="text-sm text-blue-500 underline mt-4"
            onClick={() => setSelection("")}
          >
            ⬅ Back to selection
          </button>
          <HomeGrowerGuidanceForm />
        </>
      )}
    </div>
  );
}
