import React, { useState } from "react";

const DEFAULT_RECEIVER = "mailto:agriverse.ag@gmail.com"; // Change to your default email

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Construct the mailto link
    const subject = encodeURIComponent("Application for Agricultural Consultant");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nAbout: ${form.about}\nConsultation: ${form.consultation}\nAmount: ${form.amount}\nExperience: ${form.experience}\nAddress: ${form.address}`
    );
    window.location.href = `mailto:${DEFAULT_RECEIVER}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Apply as Agricultural Consultant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />
        <textarea
          className="w-full border p-2 rounded"
          name="about"
          placeholder="About You"
          value={form.about}
          onChange={handleChange}
          required
        />
        <select
          className="w-full border p-2 rounded"
          name="consultation"
          value={form.consultation}
          onChange={handleChange}
        >
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
        <input
          className="w-full border p-2 rounded"
          type="number"
          name="amount"
          placeholder="Amount (if paid)"
          value={form.amount}
          onChange={handleChange}
          disabled={form.consultation === "free"}
        />
        <input
          className="w-full border p-2 rounded"
          type="number"
          name="experience"
          placeholder="Experience (years)"
          value={form.experience}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          Apply
        </button>
      </form>
    </div>
  );
};

export default ConsultantForm;