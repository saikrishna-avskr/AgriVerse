import React, { useState, useEffect } from 'react';
import { Plus, X, Phone, MapPin, Calendar, Package, Search, Users, ShoppingCart, Leaf } from 'lucide-react';
import Navbar from "../components/Navbar";
const Agriverse = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [filteredCrops, setFilteredCrops] = useState([]);

  // Initialize crops from localStorage or empty array
  const [crops, setCrops] = useState(() => {
    try {
      const savedCrops = localStorage.getItem('agriverse-crops');
      return savedCrops ? JSON.parse(savedCrops) : [];
    } catch (error) {
      console.error('Error loading crops from localStorage:', error);
      return [];
    }
  });

  // Initialize form data from localStorage or default empty values
  const [formData, setFormData] = useState(() => {
    try {
      const savedFormData = localStorage.getItem('agriverse-form');
      return savedFormData ? JSON.parse(savedFormData) : {
        name: '',
        cropType: '',
        customCropType: '',
        description: '',
        location: '',
        harvestDate: '',
        quantity: '',
        phone: ''
      };
    } catch (error) {
      console.error('Error loading form data from localStorage:', error);
      return {
        name: '',
        cropType: '',
        customCropType: '',
        description: '',
        location: '',
        harvestDate: '',
        quantity: '',
        phone: ''
      };
    }
  });

  // Save crops to localStorage whenever crops state changes
  useEffect(() => {
    try {
      localStorage.setItem('agriverse-crops', JSON.stringify(crops));
    } catch (error) {
      console.error('Error saving crops to localStorage:', error);
    }
  }, [crops]);

  // Save form data to localStorage whenever form data changes
  useEffect(() => {
    try {
      localStorage.setItem('agriverse-form', JSON.stringify(formData));
    } catch (error) {
      console.error('Error saving form data to localStorage:', error);
    }
  }, [formData]);

  // Filter crops based on search location
  useEffect(() => {
    if (searchLocation.trim() === '') {
      setFilteredCrops(crops);
    } else {
      const filtered = crops.filter(crop => 
        crop.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
      setFilteredCrops(filtered);
    }
  }, [crops, searchLocation]);

  // Initialize Razorpay
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFarmerPayment = async () => {
    const res = await loadRazorpay();
    if (!res) {
      alert('Razorpay SDK failed to load');
      return;
    }

    const options = {
      key: 'rzp_test_WFnrSNaNntWazE', // Your Razorpay Key ID
      amount: 400, // Rs. 4 (amount in paise) - Commission to Agriverse
      currency: 'INR',
      name: 'Agriverse',
      description: 'Farmer Registration Fee - Platform Commission',
      image: 'https://via.placeholder.com/200x200/10B981/ffffff?text=🌾',
      handler: function (response) {
        console.log('Payment Success:', response);
        // Payment successful - add crop to listing
        const displayCropType = formData.cropType === 'Other' ? formData.customCropType : formData.cropType;
        const newCrop = {
          id: Date.now(),
          name: formData.name,
          cropType: displayCropType,
          description: formData.description,
          location: formData.location,
          harvestDate: formData.harvestDate,
          quantity: formData.quantity,
          phone: formData.phone,
          contactId: `farmer_${Date.now()}`
        };

        setCrops(prevCrops => [...prevCrops, newCrop]);
        
        // Clear form data after successful submission
        const clearedFormData = {
          name: '',
          cropType: '',
          customCropType: '',
          description: '',
          location: '',
          harvestDate: '',
          quantity: '',
          phone: ''
        };
        setFormData(clearedFormData);
        
        // Clear form data from localStorage
        try {
          localStorage.setItem('agriverse-form', JSON.stringify(clearedFormData));
        } catch (error) {
          console.error('Error clearing form data from localStorage:', error);
        }
        
        setShowForm(false);
        alert(`Registration successful! Payment ID: ${response.razorpay_payment_id}\nYour crop is now listed on Agriverse!`);
      },
      prefill: {
        name: formData.name,
        contact: formData.phone,
        email: 'farmer@agriverse.com'
      },
      notes: {
        farmer_name: formData.name,
        crop_type: formData.cropType === 'Other' ? formData.customCropType : formData.cropType,
        purpose: 'farmer_registration'
      },
      theme: {
        color: '#10B981'
      },
      modal: {
        ondismiss: function() {
          console.log('Payment cancelled by farmer');
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleRetailerPayment = async (crop) => {
    const res = await loadRazorpay();
    if (!res) {
      alert('Razorpay SDK failed to load');
      return;
    }

    const options = {
      key: 'rzp_test_WFnrSNaNntWazE', // Your Razorpay Key ID
      amount: 800, // Rs. 8 (amount in paise) - Commission to Agriverse
      currency: 'INR',
      name: 'Agriverse',
      description: `Contact Access Fee - Connect with ${crop.name}`,
      image: 'https://via.placeholder.com/200x200/3B82F6/ffffff?text=🌾',
      handler: function (response) {
        console.log('Payment Success:', response);
        // Payment successful - reveal contact details
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}\n\n🎉 Contact Details Unlocked:\n📞 Phone: ${crop.phone}\n📧 Email: farmer@agriverse.com\n📍 You can now contact the farmer directly!`);
      },
      prefill: {
        name: 'Retailer',
        contact: '9876543210',
        email: 'retailer@agriverse.com'
      },
      notes: {
        crop_name: crop.name,
        farmer_name: crop.name,
        purpose: 'contact_access'
      },
      theme: {
        color: '#3B82F6'
      },
      modal: {
        ondismiss: function() {
          console.log('Payment cancelled by retailer');
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.name || !formData.cropType || !formData.description || 
        !formData.location || !formData.harvestDate || !formData.quantity || !formData.phone) {
      alert('Please fill all fields');
      return;
    }

    // Validate custom crop type if "Other" is selected
    if (formData.cropType === 'Other' && !formData.customCropType.trim()) {
      alert('Please specify your crop/item type');
      return;
    }

    // Initiate payment
    handleFarmerPayment();
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
        <Navbar />
      {/* Header */}
      {/* <header className="bg-white shadow-xl border-b-4 border-green-500">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-full">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Agriverse
                </h1>
                <p className="text-sm text-gray-500 font-medium">Bridging Agriculture & Commerce</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-500" />
                <span className="font-medium">Farmers</span>
              </div>
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Retailers & Buyers</span>
              </div>
            </div>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 leading-tight">
            Fresh Crops Directly from Farmers
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-600 mb-4 leading-relaxed">
              Connecting Farmers to Retailers & Buyers - Building Sustainable Agricultural Partnerships
            </p>
            <p className="text-lg text-gray-500 leading-relaxed">
              Browse quality crops, connect with verified farmers, and eliminate middlemen. 
              Join thousands of farmers and retailers creating direct trade relationships for better profits and fresher produce.
            </p>
          </div>
          
          {/* Stats Section */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-7 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
              <div className="text-1xl font-bold text-green-600 mb-2">{crops.length}+</div>
              <div className="text-gray-600 font-small">Active Listings</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
              <div className="text-1xl font-bold text-blue-600 mb-2">₹4</div>
              <div className="text-gray-600 font-small">Farmer Listing Fee</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
              <div className="text-1xl font-bold text-purple-600 mb-2">₹8</div>
              <div className="text-gray-600 font-small">Buyer Contact Fee</div>
            </div>
          </div> */}
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-2 mb-10 border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search by location (e.g., Punjab, Gujarat, Mumbai, Chennai...)"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 text-lg font-medium transition-all duration-200"
              />
            </div>
            {searchLocation && (
              <button
                onClick={() => setSearchLocation('')}
                className="px-6 py-4 text-gray-500 hover:text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition-all duration-200"
              >
                Clear
              </button>
            )}
          </div>
          {searchLocation && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium">
                🎯 Showing crops from: <span className="font-bold">{searchLocation}</span>
              </p>
            </div>
          )}
        </div>

        {/* Crops Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCrops.map((crop) => (
            <div key={crop.id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 transform hover:-translate-y-1">
              <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-blue-500 h-40 flex items-center justify-center relative overflow-hidden">
                <Package className="w-20 h-20 text-white opacity-90" />
                <div className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white text-sm font-medium">Fresh</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{crop.name}</h3>
                  <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold border border-green-200">
                    {crop.cropType}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{crop.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-500">
                    <MapPin className="w-4 h-4 mr-3 text-green-500" />
                    <span className="text-sm font-medium">{crop.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-3 text-blue-500" />
                    <span className="text-sm font-medium">Harvest: {crop.harvestDate}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Package className="w-4 h-4 mr-3 text-purple-500" />
                    <span className="text-sm font-medium">Quantity: {crop.quantity}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleRetailerPayment(crop)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Farmer (₹8)
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State - No crops found in search */}
        {filteredCrops.length === 0 && crops.length > 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">No crops found in "{searchLocation}"</h3>
            <p className="text-gray-500 text-lg">Try searching for a different location or clear the search to see all listings.</p>
          </div>
        )}

        {/* Empty State - No crops at all */}
        {crops.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-green-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
              <Package className="w-16 h-16 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">No crops listed yet</h3>
            <p className="text-gray-500 text-lg mb-6">Be the first farmer to list your crops and connect with buyers!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              List Your First Crop
            </button>
          </div>
        )}
      </main>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 z-50 transform hover:scale-110"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Farmer Registration Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-gray-800">List Your Crop</h3>
                  <p className="text-gray-500 mt-1">Connect with buyers across India</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Farmer Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 font-medium"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Crop/Item Type *
                  </label>
                  <select
                    name="cropType"
                    value={formData.cropType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 font-medium"
                    required
                  >
                    <option value="">Select crop/item type</option>
                    <option value="Paddy">Paddy</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Cereals">Cereals</option>
                    <option value="Spices">Spices</option>
                    <option value="Dairy Products">Dairy Products</option>
                    <option value="Organic Products">Organic Products</option>
                    <option value="Other">Other (Specify below)</option>
                  </select>
                </div>

                {formData.cropType === 'Other' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Specify Your Crop/Item *
                    </label>
                    <input
                      type="text"
                      name="customCropType"
                      value={formData.customCropType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 font-medium"
                      placeholder="e.g., Medicinal Plants, Bamboo, etc."
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 font-medium"
                    placeholder="Price per kg/ton, quality details, organic/chemical-free, farming methods, certifications, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 font-medium"
                    placeholder="Village, City, State"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Harvest/Available Date *
                  </label>
                  <input
                    type="date"
                    name="harvestDate"
                    value={formData.harvestDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Quantity Available *
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 font-medium"
                    placeholder="e.g., 50 tons, 100 kg, 500 liters"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 font-medium"
                    placeholder="+91-9876543210"
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Pay ₹4 & List Crop
                  </button>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong className="text-green-700">💡 Platform Fee:</strong> A minimal registration fee of ₹4 helps us maintain quality listings and verify farmers. 
                  Buyers pay ₹8 to access your contact details, ensuring serious inquiries only.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agriverse;