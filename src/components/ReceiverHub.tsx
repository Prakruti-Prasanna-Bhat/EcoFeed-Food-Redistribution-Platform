import React, { useState } from 'react';
import { MapPin, Clock, CheckCircle, Leaf } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  listing: any;
}

function ConfirmModal({ isOpen, onClose, onConfirm, listing }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Food Rescue</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to accept <span className="font-semibold">{listing?.title}</span>? 
          You'll need to pick it up within the next <span className="font-semibold text-orange-600">{listing?.expiry}</span>.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
          >
            Confirm Accept
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function ReceiverHub() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const listings = [
    {
      id: 1,
      title: 'Leftover Breakfast Pastries',
      category: 'Bakery',
      categoryColor: 'bg-orange-100 text-orange-700',
      quantity: '5kg',
      expiry: '2h 15m',
      priority: 85,
      allergens: ['Gluten', 'Dairy'],
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      title: 'Mixed Vegetable Curry',
      category: 'Cooked Meals',
      categoryColor: 'bg-green-100 text-green-700',
      quantity: '10 Portions',
      expiry: '2h 15m',
      priority: 92,
      allergens: [],
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      title: 'Fresh Garden Salad Mix',
      category: 'Vegetables',
      categoryColor: 'bg-green-100 text-green-700',
      quantity: '15kg',
      expiry: '4h 30m',
      priority: 68,
      allergens: [],
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    },
    {
      id: 4,
      title: 'Artisan Bread Loaves',
      category: 'Bakery',
      categoryColor: 'bg-orange-100 text-orange-700',
      quantity: '20 Loaves',
      expiry: '6h 00m',
      priority: 75,
      allergens: ['Gluten'],
      image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop',
    },
  ];

  const handleAccept = (listing: any) => {
    setSelectedListing(listing);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    setModalOpen(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Available Surplus Food Nearby</h1>
            <p className="text-gray-600">Real-time matching with AI prioritization</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-200">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">Live Radius: 5km</span>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {listings.map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all"
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-100">
              <ImageWithFallback
                src={listing.image}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${listing.categoryColor}`}>
                  {listing.category}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-green-600 text-white">
                  {listing.priority}% High Priority
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-bold text-gray-900 text-lg mb-4">{listing.title}</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">QUANTITY</span>
                  <span className="font-semibold text-gray-900">{listing.quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">EXPIRES IN</span>
                  <span className="font-semibold text-orange-600 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {listing.expiry}
                  </span>
                </div>
              </div>

              {/* Allergens */}
              <div className="mb-4">
                {listing.allergens.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {listing.allergens.map((allergen) => (
                      <span
                        key={allergen}
                        className="px-2 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-medium border border-red-100"
                      >
                        ⚠ {allergen}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
                    ✓ Allergen Free
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleAccept(listing)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  Accept
                </button>
                {listing.quantity.includes('Portions') && (
                  <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <Leaf className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State (hidden when listings exist) */}
      {listings.length === 0 && (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Listings Available</h3>
          <p className="text-gray-600">Check back soon for new surplus food in your area.</p>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        listing={selectedListing}
      />

      {/* Success Toast */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50"
        >
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold">Food rescue confirmed!</div>
            <div className="text-sm text-green-100">Pickup details sent to your email</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
