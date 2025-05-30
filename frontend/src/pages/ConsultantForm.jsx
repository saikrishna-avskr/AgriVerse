import React, { useState } from "react";
import { send } from "@emailjs/browser";
import { useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";

const DEFAULT_RECEIVER = "agriverse.ag@gmail.com";
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const USER_ID = import.meta.env.VITE_EMAILJS_USER_ID;

const inputStyle =
  "input-style p-4 border border-gray-300 rounded-2xl w-full focus:ring-4 focus:ring-emerald-300 transition-all duration-200 placeholder-gray-400 bg-gray-50";

const ConsultantForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    about: "",
    consultation: "free",
    amount: "",
    experience: "",
    address: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nAbout: ${form.about}\nConsultation: ${form.consultation}\nAmount: ${form.amount}\nExperience: ${form.experience}\nAddress: ${form.address}`;
    const templateParams = {
      from_name: form.name,
      email: form.email,
      message: message,
    };

    send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID)
      .then(() => {
        alert("✅ Thank you for your interest! We’ve received your application.");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        alert("⚠️ There was a problem. Please try again.");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-blue-100 py-20 px-4 flex justify-center items-center">
      <div className="bg-white p-12 md:p-16 rounded-3xl shadow-2xl w-full max-w-2xl relative">
        {/* Title Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-3 text-emerald-700">
            <Briefcase className="w-8 h-8" />
            <span className="uppercase tracking-widest text-base font-semibold">Join Us</span>
          </div>
          <h2 className="text-4xl font-extrabold text-emerald-900 mb-2">Become an Agricultural Consultant</h2>
          <p className="text-gray-600 mt-2 text-lg">
            Fill out the form to apply and help farmers thrive 🌾
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              className={inputStyle}
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              className={inputStyle}
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              className={inputStyle}
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />
            <input
              className={inputStyle}
              type="number"
              name="experience"
              placeholder="Years of Experience"
              value={form.experience}
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            className={inputStyle + " resize-none"}
            rows="4"
            name="about"
            placeholder="Tell us about your background"
            value={form.about}
            onChange={handleChange}
            required
          />

          <div className="flex flex-col md:flex-row gap-6">
            <select
              className={inputStyle}
              name="consultation"
              value={form.consultation}
              onChange={handleChange}
            >
              <option value="free">Free Consultation</option>
              <option value="paid">Paid Consultation</option>
            </select>

            <input
              className={inputStyle}
              type="number"
              name="amount"
              placeholder="Amount (₹)"
              value={form.amount}
              onChange={handleChange}
              disabled={form.consultation === "free"}
            />
          </div>

          <input
            className={inputStyle}
            type="text"
            name="address"
            placeholder="Your Address"
            value={form.address}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-200 mt-4"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsultantForm;
