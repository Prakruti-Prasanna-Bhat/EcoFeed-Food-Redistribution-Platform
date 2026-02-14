import React, { useState } from 'react';
import { Heart, Trash2, Wind, Package, Clock, MapPin, Edit, Eye, Users, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export function DonorPortal() {
  const [showToast, setShowToast] = useState(false);

  const metrics = [
    { icon: Heart, label: 'Meals Provided', value: '1,284', color: 'text-pink-500', bg: 'bg-pink-50' },
    { icon: Trash2, label: 'Food Waste Reduced', value: '450kg', color: 'text-green-500', bg: 'bg-green-50' },
    { icon: Wind, label: 'CO₂ Saved', value: '1.2 Tons', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Package, label: 'Active Listings', value: '3', color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  const listings = [
    {
      id: 1,
      urgency: 85,
      title: 'Leftover Breakfast Pastries',
      category: 'Bakery',
      categoryColor: 'bg-orange-100 text-orange-700',
      quantity: '5kg',
      expiry: '07:30 PM',
      location: 'Central Plaza Hotel',
      hasMatches: true,
    },
    {
      id: 2,
      urgency: 92,
      title: 'Mixed Vegetable Curry',
      category: 'Cooked Meals',
      categoryColor: 'bg-green-100 text-green-700',
      quantity: '10 Portions',
      expiry: '09:30 PM',
      location: 'The Green Bistro',
      hasMatches: true,
    },
  ];

  const rescuers = [
    {
      id: 1,
      name: 'City Rescue Mission',
      distance: '1.2 km away',
      capacity: 'High Capacity',
      categories: ['Cooked Meals', 'Bakery'],
      verified: true,
    },
    {
      id: 2,
      name: 'Sunshine Shelter',
      distance: '2.5 km away',
      capacity: 'Medium Capacity',
      categories: ['Vegetables', 'Fruits'],
      verified: true,
    },
    {
      id: 3,
      name: 'Community Fridge Downtown',
      distance: '3.5 km away',
      capacity: 'Small Capacity',
      categories: ['Dairy', 'Bakery'],
      verified: false,
    },
  ];

  const handleViewMatches = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="p-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-gray-600 text-sm mb-2">{metric.label}</div>
                <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
              </div>
              <div className={`${metric.bg} p-3 rounded-xl`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Listings Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Live Surplus Food Listings</h2>
            </div>
            <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2">
              <Package className="w-4 h-4" />
              Post Surplus
            </button>
          </div>

          <div className="space-y-4">
            {listings.map((listing) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      listing.urgency > 90 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {listing.urgency}% Urgent
                    </span>
                    <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">{listing.title}</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${listing.categoryColor}`}>
                      {listing.category}
                    </span>
                    <span>• {listing.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Expires: {listing.expiry}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 col-span-2">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.location}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleViewMatches}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View Matches
                  </button>
                  <button className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium">
                    🌱 Donation or Compost
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Active Rescuers */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-gray-900">Active Rescuers Nearby</h3>
            </div>

            <div className="space-y-4">
              {rescuers.map((rescuer) => (
                <div key={rescuer.id} className="pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{rescuer.name}</h4>
                        {rescuer.verified && (
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{rescuer.distance} • {rescuer.capacity}</div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {rescuer.categories.map((cat) => (
                          <span key={cat} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium">
              View Map Explorer →
            </button>
          </div>

          {/* AI Insight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 shadow-lg text-white"
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5" />
              <h3 className="font-bold">AI INSIGHT</h3>
            </div>
            <p className="text-green-50">
              NGO "Sunshine Shelter" is low on protein. Your meat listings will be prioritized to them today.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3"
        >
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-medium">3 matching NGOs found nearby!</span>
        </motion.div>
      )}
    </div>
  );
}
