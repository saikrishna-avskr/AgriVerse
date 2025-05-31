import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Plus, X, ExternalLink, Tag, Gift, Droplets } from "lucide-react";

// PromotionForm component: Displays a list of promotions and allows users to submit their own
export default function PromotionForm() {
  const formRef = useRef(); // Ref for the form element (used by EmailJS)
  const [status, setStatus] = useState(""); // Status message for submission feedback
  const [isFormOpen, setIsFormOpen] = useState(false); // Controls modal visibility
  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    description: "",
    link: ""
  });

  // Handle input changes for controlled form fields
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handles form submission and sends data via EmailJS
  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("Sending...");

    emailjs
      .sendForm(
        "service_8tz9wa3",      // Your EmailJS service ID
        "template_gxhel1x",     // Your EmailJS template ID
        formRef.current,
        "hEkKhT8DapILXCLE7"     // Your EmailJS public key
      )
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
          setStatus("Promotion submitted successfully!");
          // Reset form fields after success
          setFormData({ name: "", email: "", title: "", description: "", link: "" });
          // Close modal after 2 seconds
          setTimeout(() => {
            setIsFormOpen(false);
            setStatus("");
          }, 2000);
        },
        (error) => {
          console.error('FAILED...', error);
          setStatus("Failed to send. Please try again later.");
        }
      );
  };

  // Example promotions to display as cards
  const promotions = [
    {
      title: "Professional Drone Package",
      description: "Limited time discount on high-quality agricultural drones. Perfect for crop monitoring and precision farming.",
      link: "https://www.instagram.com/prdroneswgl?igsh=Z3FxY3dnZjU4ZTJz",
      category: "Equipment",
      discount: "25% OFF",
      icon: <Tag className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=250&fit=crop&crop=center"
    },
    {
      title: "Free Soil Testing Service",
      description: "Get your farm soil tested for free with this exclusive promotion. Comprehensive analysis included.",
      link: "https://www.instagram.com/villageagriculture_yt?igsh=ajJ4bGdsczZlZ2N3",
      category: "Testing",
      discount: "FREE",
      icon: <Gift className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop&crop=center"
    },
    {
      title: "Complete Drip Irrigation Kit",
      description: "Buy a complete drip irrigation setup at an amazing discount. Everything you need for efficient watering.",
      link: "https://example.com/dripkit",
      category: "Irrigation",
      discount: "15% OFF",
      icon: <Droplets className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop&crop=center"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 md:p-8 relative">
      {/* Header section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Agricultural Promotions
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover amazing deals on farming equipment, services, and solutions to boost your agricultural productivity
        </p>
      </div>

      {/* Promotions Grid */}
      <div className="max-w-7xl mx-auto space-y-6 mb-20">
        {promotions.map((promo, index) => (
          <div key={index} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Promotion image and discount badge */}
              <div className="md:w-1/3 relative">
                <img src={promo.image} alt={promo.title} className="w-full h-48 object-cover" />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {promo.discount}
                  </span>
                </div>
              </div>
              {/* Promotion details */}
              <div className="md:w-2/3 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {promo.category}
                  </span>
                  {promo.icon}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
                  {promo.title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {promo.description}
                </p>
                {/* Link to promotion */}
                <a
                  href={promo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  View Promotion
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button to open the submission form */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal for submitting a new promotion */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg relative">
            {/* Close button */}
            <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-purple-700">Submit Your Promotion</h2>
            {/* Submission form */}
            <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
              {/* Name input */}
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                className="p-3 border rounded-xl w-full"
                required
              />
              {/* Email input */}
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                className="p-3 border rounded-xl w-full"
                required
              />
              {/* Promotion title input */}
              <input
                type="text"
                name="title"
                placeholder="Promotion Title"
                value={formData.title}
                onChange={handleInputChange}
                className="p-3 border rounded-xl w-full"
                required
              />
              {/* Description textarea */}
              <textarea
                name="description"
                placeholder="Describe your promotion"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="p-3 border rounded-xl w-full"
                required
              ></textarea>
              {/* Link input */}
              <input
                type="url"
                name="link"
                placeholder="Link to product/website"
                value={formData.link}
                onChange={handleInputChange}
                className="p-3 border rounded-xl w-full"
                required
              />
              {/* Submit button */}
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl w-full"
              >
                Submit Promotion
              </button>
              {/* Status message after submission */}
              {status && <p className="text-center text-sm text-green-600 mt-2">{status}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
