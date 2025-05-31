import React, { useEffect, useState } from "react";
import { Briefcase, Mail, Phone, User, Info, MapPin, Coins, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import navigation hook

// Consultants component: Displays a list of agricultural consultants and a button to become one
const Consultants = () => {
  // State to store consultants data fetched from backend
  const [consultants, setConsultants] = useState([]);
  // State to manage loading spinner
  const [loading, setLoading] = useState(true);
  // State to show fetch status message
  const [message, setMessage] = useState("");
  // React Router's navigation hook for page navigation
  const navigate = useNavigate();

  // Fetch consultants data from backend API on component mount
  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        // Fetch data from backend endpoint
        const res = await fetch("http://localhost:8000/api/consultants/");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setConsultants(data); // Set fetched consultants
        setMessage("Data fetched successfully!");
      } catch (err) {
        setMessage("Failed to fetch");
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };
    fetchConsultants();
  }, []);

  // Show loading spinner while fetching data
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-lg font-medium">
        Loading...
      </div>
    );

  // Show error message if fetch failed
  if (message === "Failed to fetch") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
        {message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6 md:p-12">
      {/* Page Title and Subtitle */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Agricultural Consultants
        </h1>
        <p className="text-gray-600 text-lg">
          Connect with trusted experts in agriculture and farming solutions.
        </p>
      </div>
      {/* Success or info message */}
      <div className="text-center text-green-700 text-md mb-6">{message}</div>

      {/* Consultants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {consultants.map((consultant) => (
          <div
            key={consultant.id}
            className="bg-white rounded-2xl shadow-lg p-6 transition-transform transform hover:scale-105 border border-gray-100"
          >
            {/* Consultant Name and Icon */}
            <div className="flex items-center gap-3 mb-3">
              <User className="text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">{consultant.name}</h2>
            </div>
            {/* Consultant Details */}
            <div className="text-gray-600 text-sm space-y-2">
              {/* Email */}
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                <a
                  href={`mailto:${consultant.email}`}
                  className="hover:underline text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {consultant.email}
                </a>
              </p>
              {/* Phone */}
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-500" />
                <a
                  href={`tel:${consultant.phone_number}`}
                  className="hover:underline text-green-700"
                >
                  {consultant.phone_number}
                </a>
              </p>
              {/* About */}
              <p className="flex items-start gap-2">
                <Info className="w-4 h-4 text-purple-500" /> {consultant.about_me}
              </p>
              {/* Consultation Type */}
              <p className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-500" /> {consultant.consultation}
              </p>
              {/* Amount */}
              <p className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-600" /> ₹{consultant.amount}
              </p>
              {/* Experience */}
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-pink-500" /> {consultant.experience} years
              </p>
              {/* Address */}
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500" /> {consultant.address}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Be a Consultant Button */}
      <div className="flex justify-end mt-10">
        <button
          onClick={() => navigate("/be-consultant")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition"
        >
          Be a Consultant
        </button>
      </div>
    </div>
  );
};

export default Consultants;