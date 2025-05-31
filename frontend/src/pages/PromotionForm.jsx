import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

// PromotionForm component: Displays promotions and allows users to submit their own promotion
export default function PromotionForm() {
  const form = useRef(); // Ref for the form element
  const [status, setStatus] = useState(""); // Status message for submission feedback

  // Handles form submission and sends data via EmailJS
  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("Sending...");

    emailjs
      .sendForm(
        "service_8tz9wa3",      // Replace with your EmailJS service ID
        "template_gxhel1x",     // Replace with your EmailJS template ID
        form.current,
        "hEkKhT8DapILXCLE7"     // Replace with your EmailJS public key
      )
      .then(
        () => {
          setStatus("Promotion submitted successfully!");
          form.current.reset(); // Reset form fields after success
        },
        (error) => {
          console.error(error.text);
          setStatus("Failed to send. Please try again later.");
        }
      );
  };

  // Example promotions to display as cards
  const promotions = [
    {
      title: "Drone",
      description: "Limited time discount.",
      link: "https://www.instagram.com/prdroneswgl?igsh=Z3FxY3dnZjU4ZTJz",
    },
    {
      title: "Free Soil Testing",
      description: "Get your farm soil tested for free with this promotion.",
      link: "https://www.instagram.com/villageagriculture_yt?igsh=ajJ4bGdsczZlZ2N3 ",
    },
    {
      title: "Drip Irrigation Kit",
      description: "Buy a complete drip irrigation setup at 15% off.",
      link: "https://example.com/dripkit",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Page title */}
      <h1 className="text-3xl font-bold text-center mb-8 text-purple-700">Promotions</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Side - Promotion Cards */}
        <div className="space-y-6">
          {promotions.map((promo, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-md border">
              <h2 className="text-xl font-semibold text-green-700">{promo.title}</h2>
              <p className="text-gray-700 mt-2">{promo.description}</p>
              <a
                href={promo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline mt-2 inline-block"
              >
                View Promotion
              </a>
            </div>
          ))}
        </div>

        {/* Right Side - Submission Form */}
        <form
          ref={form}
          onSubmit={sendEmail}
          className="bg-white p-6 rounded-2xl shadow-md space-y-4 border"
        >
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">Submit Your Promotion</h2>
          {/* Name input */}
          <input
            className="p-3 border rounded-xl w-full"
            type="text"
            name="name"
            placeholder="Your Name"
            required
          />
          {/* Email input */}
          <input
            className="p-3 border rounded-xl w-full"
            type="email"
            name="email"
            placeholder="Your Email"
            required
          />
          {/* Promotion title input */}
          <input
            className="p-3 border rounded-xl w-full"
            type="text"
            name="title"
            placeholder="Promotion Title"
            required
          />
          {/* Description textarea */}
          <textarea
            className="p-3 border rounded-xl w-full"
            name="description"
            placeholder="Describe your promotion"
            rows="5"
            required
          />
          {/* Link input */}
          <input
            className="p-3 border rounded-xl w-full"
            type="url"
            name="link"
            placeholder="Link to product/website"
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
          {status && (
            <p className="text-center text-sm text-green-600 mt-2">{status}</p>
          )}
        </form>
      </div>
    </div>
  );
}
