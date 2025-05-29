import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Star, Filter, Grid, List, ChevronRight, Zap, Shield, Award } from 'lucide-react';
import soilPhTester from '../assets/ph.png';
import moisture from '../assets/moisture.png';
import spray from '../assets/spray.png';
import tiller from '../assets/tiller.png';
import prune from '../assets/prune.png';
import tray from '../assets/tray.png';
import hoe from '../assets/hoe.png';
import chaff from '../assets/chaff.png';
import knap from '../assets/knap.png';
import trim from '../assets/trim.png';
import cow from '../assets/cow.png';
import vermi from '../assets/vermi.png';
import green from '../assets/green.png';
import bin from '../assets/bin.png';
import pre from '../assets/pre.png';
// Sample images - in your actual implementation, these would be your imported images


const featuredProducts = [
  {
    name: 'Soil pH Tester Kit',
    image: soilPhTester,
    link: 'https://www.amazon.in/s?k=ph%2Bsensor%2Bfor%2Brice%2Bfarming&tag=yourtag-21',
    price: '₹899',
    originalPrice: '₹1,299',
    rating: 4.5,
    reviews: 324,
    category: 'Testing Equipment',
    isPopular: true,
    features: ['Digital Display', 'Waterproof', '3-in-1 Function']
  },
  {
    name: 'Digital Moisture Meter',
    image: moisture,
    link: 'https://www.amazon.in/s?k=Digital%2BMoisture%2BMeter&tag=yourtag-21',
    price: '₹1,299',
    originalPrice: '₹1,799',
    rating: 4.7,
    reviews: 156,
    category: 'Testing Equipment',
    features: ['LCD Display', 'Auto Power Off', 'Compact Design']
  },
  {
    name: 'Battery Sprayer',
    image: spray,
    link: 'https://www.amazon.in/s?k=Battery%2BSprayer&tag=yourtag-211',
    price: '₹2,499',
    originalPrice: '₹3,199',
    rating: 4.3,
    reviews: 89,
    category: 'Spraying Tools',
    isNew: true,
    features: ['12V Battery', '16L Capacity', 'Adjustable Nozzle']
  },
  {
    name: 'Hand Tiller Tool',
    image: tiller,
    link: 'https://www.amazon.in/s?k=Hand%2BTiller%2BTool&tag=yourtag-21',
    price: '₹449',
    originalPrice: '₹699',
    rating: 4.2,
    reviews: 267,
    category: 'Hand Tools',
    features: ['Ergonomic Handle', 'Rust Resistant', 'Lightweight']
  },
  {
    name: 'Garden Pruner Shears',
    image: prune,
    link: 'https://www.amazon.in/s?k=Garden%2BPruner%2BShears&tag=yourtag-21',
    price: '₹599',
    originalPrice: '₹899',
    rating: 4.6,
    reviews: 432,
    category: 'Cutting Tools',
    isPopular: true,
    features: ['Sharp Blades', 'Safety Lock', 'Comfortable Grip']
  },
  {
    name: 'Seedling Tray (98 Cavities)',
    image: tray,
    link: 'https://www.amazon.in/s?k=Seedling%2BTray%2B%2898%2BCavities%29&tag=yourtag-21',
    price: '₹199',
    originalPrice: '₹299',
    rating: 4.4,
    reviews: 178,
    category: 'Nursery Supplies',
    features: ['98 Cavities', 'Drainage Holes', 'Reusable']
  },
  {
    name: 'Garden Hoe with Wooden Handle',
    image: hoe,
    link: 'https://www.amazon.in/s?k=Garden%2BHoe%2Bwith%2BWooden%2BHandle&tag=yourtag-21',
    price: '₹399',
    originalPrice: '₹599',
    rating: 4.1,
    reviews: 98,
    category: 'Hand Tools',
    features: ['Wooden Handle', 'Sharp Edge', 'Durable Steel']
  },
  {
    name: 'Electric Chaff Cutter',
    image: chaff,
    link: 'https://www.amazon.in/s?k=Electric%2BChaff%2BCutter&tag=yourtag-21',
    price: '₹8,999',
    originalPrice: '₹12,999',
    rating: 4.5,
    reviews: 45,
    category: 'Power Tools',
    isNew: true,
    features: ['1HP Motor', 'Safety Guard', 'Easy Maintenance']
  },
  {
    name: 'KnapSack Sprayer',
    image: knap,
    link: 'https://www.amazon.in/s?k=KnapSack%2BSprayer&tag=yourtag-21',
    price: '₹1,899',
    originalPrice: '₹2,499',
    rating: 4.3,
    reviews: 123,
    category: 'Spraying Tools',
    features: ['20L Capacity', 'Pressure Relief', 'Padded Straps']
  },
  {
    name: 'Irrigation Timer',
    image: trim,
    link: 'https://www.amazon.in/s?k=Irrigation%2BTimer&tag=yourtag-21',
    price: '₹2,299',
    originalPrice: '₹2,999',
    rating: 4.0,
    reviews: 67,
    category: 'Irrigation',
    features: ['Programmable', 'Weather Resistant', 'Easy Setup']
  },
  {
    name: 'Cow Dung Manure - 5Kg',
    image: cow,
    link: 'https://www.amazon.in/s?k=Cow%2BDung%2BManure%2B-%2B5Kg&tag=yourtag-21',
    price: '₹299',
    originalPrice: '₹399',
    rating: 4.8,
    reviews: 234,
    category: 'Fertilizers',
    isPopular: true,
    features: ['Organic', '5Kg Pack', 'Nutrient Rich']
  },
  {
    name: 'Vermicompost Fertilizer',
    image: vermi,
    link: 'https://www.amazon.in/s?k=Vermicompost%2BFertilizer&tag=yourtag-21',
    price: '₹399',
    originalPrice: '₹549',
    rating: 4.7,
    reviews: 189,
    category: 'Fertilizers',
    features: ['100% Organic', 'Rich in Nutrients', 'Eco-Friendly']
  },
  {
    name: 'Mini Greenhouse Tent',
    image: green,
    link: 'https://www.amazon.in/s?k=Mini%2BGreenhouse%2BTent&tag=yourtag-21',
    price: '₹3,999',
    originalPrice: '₹5,499',
    rating: 4.2,
    reviews: 78,
    category: 'Structures',
    isNew: true,
    features: ['UV Protection', 'Easy Assembly', 'Ventilation Windows']
  },
  {
    name: 'Compost Bin Kit',
    image: bin,
    link: 'https://www.amazon.in/s?k=Compost%2BBin%2BKit&tag=yourtag-21',
    price: '₹1,799',
    originalPrice: '₹2,399',
    rating: 4.4,
    reviews: 156,
    category: 'Composting',
    features: ['Large Capacity', 'Aeration System', 'Weather Resistant']
  },
  {
    name: 'Agri Spray Nozzle Set',
    image: pre,
    link: 'https://www.amazon.in/s?k=Agri%2BSpray%2BNozzle%2BSet&tag=yourtag-21',
    price: '₹799',
    originalPrice: '₹1,099',
    rating: 4.3,
    reviews: 112,
    category: 'Spraying Tools',
    features: ['Multiple Patterns', 'Brass Construction', 'Universal Fit']
  },
];

const categories = ['All', 'Testing Equipment', 'Hand Tools', 'Spraying Tools', 'Power Tools', 'Fertilizers', 'Nursery Supplies', 'Irrigation', 'Structures', 'Composting', 'Cutting Tools'];

const AgroMarket = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [filteredProducts, setFilteredProducts] = useState(featuredProducts);
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    let filtered = featuredProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => parseInt(a.price.replace('₹', '').replace(',', '')) - parseInt(b.price.replace('₹', '').replace(',', '')));
        break;
      case 'price-high':
        filtered.sort((a, b) => parseInt(b.price.replace('₹', '').replace(',', '')) - parseInt(a.price.replace('₹', '').replace(',', '')));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortBy]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const ProductCard = ({ product }) => (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
      {/* Product Badges */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.isPopular && (
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Popular
            </span>
          )}
          {product.isNew && (
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              New
            </span>
          )}
        </div>
        
        {/* Discount Badge */}
        {product.originalPrice && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
              {Math.round((1 - parseInt(product.price.replace('₹', '').replace(',', '')) / parseInt(product.originalPrice.replace('₹', '').replace(',', ''))) * 100)}% OFF
            </span>
          </div>
        )}

        <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-contain group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Category */}
        <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
          {product.category}
        </span>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm font-medium text-gray-700">{product.rating}</span>
          <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
        </div>

        {/* Features */}
        <div className="space-y-1">
          {product.features.slice(0, 2).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              {feature}
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-gray-900">{product.price}</span>
          {product.originalPrice && (
            <span className="text-lg text-gray-500 line-through">{product.originalPrice}</span>
          )}
        </div>

        {/* Action Button */}
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          <ShoppingCart className="w-5 h-5" />
          Buy on Amazon
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Agro Market
              <span className="block text-2xl md:text-3xl font-normal mt-2 text-green-100">
                Premium Agricultural Tools & Equipment
              </span>
            </h1>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Discover professional-grade farming tools with the best prices and quality guarantee. 
              Trusted by thousands of farmers across India.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Quality Assured</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>Expert Recommended</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for agricultural tools..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchTerm.trim()) {
                    const amazonUrl = `https://www.amazon.in/s?k=${encodeURIComponent(searchTerm + ' agriculture farming tools')}&tag=yourtag-21`;
                    window.open(amazonUrl, '_blank');
                  }
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    const amazonUrl = `https://www.amazon.in/s?k=${encodeURIComponent(searchTerm + ' agriculture farming tools')}&tag=yourtag-21`;
                    window.open(amazonUrl, '_blank');
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Search on Amazon
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <select
                className="w-full py-4 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-lg bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                className="w-full py-4 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-lg bg-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </h2>
            <p className="text-gray-600">
              Showing {filteredProducts.length} products
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-md text-green-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-md text-green-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>


    </div>
  );
};

export default AgroMarket;