import React, { useState } from "react";
import { send } from "@emailjs/browser";
import { useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";

// EmailJS configuration
const DEFAULT_RECEIVER = "agriverse.ag@gmail.com";
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const USER_ID = import.meta.env.VITE_EMAILJS_USER_ID;

// Tailwind CSS input style for consistent UI
const inputStyle =
  "input-style p-4 border border-gray-300 rounded-2xl w-full focus:ring-4 focus:ring-emerald-300 transition-all duration-200 placeholder-gray-400 bg-gray-50";

const ConsultantForm = () => {
  // State to manage form fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: 0,
    about: "",
    consultation: "free",
    amount: 0,
    experience: 0,
    address: "",
  });

  const navigate = useNavigate();

  // Dynamically load Razorpay SDK
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle form submission and payment
  const handlePaymentAndSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!form.name || !form.email || !form.phone || !form.about || !form.experience) {
      alert("Please fill all required fields.");
      return;
    }

    // Load Razorpay SDK
    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load. Please try again.");
      return;
    }

    // Razorpay payment options
    const options = {
      key: "rzp_test_WFnrSNaNntWazE", // Replace with your Razorpay Key ID
      amount: 10000, // Rs. 100 (amount in paise)
      currency: "INR",
      name: "Agriverse",
      description: "Consultant Application Fee",
      image: "https://via.placeholder.com/200x200/10B981/ffffff?text=🌾",
      handler: function (response) {
        // Prepare data for database (match Django model fields)
        const dbData = {
          name: form.name,
          email: form.email,
          phone_number: form.phone,      // Django expects 'phone_number'
          about_me: form.about,          // Django expects 'about_me'
          consultation: form.consultation,
          amount: form.amount,
          experience: form.experience,
          address: form.address,
          // payment_id: response.razorpay_payment_id, // Uncomment if your model supports it
          // date: new Date().toISOString(),           // Uncomment if your model supports it
        };

        // Save consultant details to the backend database
        saveConsultantToDB(dbData);

        // Prepare parameters for EmailJS template
        const templateParams = {
          ...dbData,
          from_name: form.name,
          // Add more email params if needed
        };

        // Send confirmation email via EmailJS
        send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID)
          .then(() => {
            alert("✅ Thank you for your interest! We’ve received your application.");
            navigate("/");
          })
          .catch((error) => {
            console.error("Error sending email:", error);
            alert("⚠️ There was a problem. Please try again. " + (error?.text || error?.message || error));
          });
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      notes: {
        applicant: form.name,
        purpose: "consultant_application",
      },
      theme: {
        color: "#10B981",
      },
      modal: {
        ondismiss: function () {
          alert("Payment cancelled.");
        },
      },
    };

    // Open Razorpay payment window
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  // Handle input changes for all form fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Function to save consultant details to the backend database
  const saveConsultantToDB = async (data) => {
    try {
      console.log(data);
      await fetch("http://localhost:8000/api/consultants/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("DB Error:", error);
    }
  };

  // Render the consultant application form
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

        {/* Consultant Application Form */}
        <form className="space-y-7" onSubmit={handlePaymentAndSubmit}>
          {/* Two-column grid for main fields */}
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
              required
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

          {/* About textarea */}
          <textarea
            className={inputStyle + " resize-none"}
            rows="4"
            name="about"
            placeholder="Tell us about your background"
            value={form.about}
            onChange={handleChange}
            required
          />

          {/* Consultation type and amount */}
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

          {/* Address field */}
          <input
            className={inputStyle}
            type="text"
            name="address"
            placeholder="Your Address"
            value={form.address}
            onChange={handleChange}
          />

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-200 mt-4"
          >
            Pay & Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsultantForm;
