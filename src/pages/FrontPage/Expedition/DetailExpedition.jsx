import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExpeditionById } from '../../../services/expeditionService';

const DetailExpedition = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expedition, setExpedition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch expedition detail
  const fetchExpeditionDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getExpeditionById(id);
      setExpedition(response);
      
    } catch (err) {
      setError(err.message || 'Failed to load expedition details');
      console.error('Error fetching expedition details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchExpeditionDetail();
    }
  }, [id]);

  // Format pricing
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Handle booking
  const handleBooking = () => {
    setShowBookingModal(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F4F4F4' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-start space-x-6 mb-6">
                <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F4F4F4' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-semibold text-red-800 mb-2">Failed to Load Expedition</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="space-x-4">
              <button 
                onClick={fetchExpeditionDetail}
                className="px-6 py-2 text-white font-medium rounded-md hover:opacity-90 transition-opacity duration-200"
                style={{ backgroundColor: '#39B54A' }}
              >
                Try Again
              </button>
              <button 
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No expedition found
  if (!expedition) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F4F4F4' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Expedition Not Found</h2>
            <p className="text-gray-500 mb-6">The expedition you're looking for doesn't exist or has been removed.</p>
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-2 text-white font-medium rounded-md hover:opacity-90 transition-opacity duration-200"
              style={{ backgroundColor: '#39B54A' }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Parse data
  const pricing = JSON.parse(expedition.pricing_scheme);
  const vehicles = JSON.parse(expedition.vehicle_types);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F4F4' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button 
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500">Expeditions</span>
            <span className="text-gray-400">/</span>
            <span className="font-medium" style={{ color: '#585656' }}>{expedition.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
              {/* Profile Image */}
              <div className="flex-shrink-0 mb-6 lg:mb-0">
                <img
                  src={expedition.profile_picture || '/api/placeholder/200/200'}
                  alt={`${expedition.name} profile`}
                  className="w-32 h-32 lg:w-48 lg:h-48 rounded-full object-cover border-4 border-gray-200 mx-auto lg:mx-0"
                />
              </div>

              {/* Expedition Info */}
              <div className="flex-1">
                <div className="text-center lg:text-left">
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#585656' }}>
                    {expedition.name}
                  </h1>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(expedition.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-lg font-semibold ml-2" style={{ color: '#585656' }}>
                        {expedition.rating}/5
                      </span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{expedition.total_deliveries} deliveries</span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center lg:justify-start">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-700">{expedition.phone_number}</span>
                    </div>
                    <div className="flex items-start justify-center lg:justify-start">
                      <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-700">{expedition.company_address}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                    <button
                      onClick={handleBooking}
                      className="px-8 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-lg"
                      style={{ backgroundColor: '#39B54A' }}
                    >
                      Book Now
                    </button>
                    <button className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      Contact Expedition
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'overview', label: 'Overview', icon: 'M4 6h16M4 12h16M4 18h16' },
                { id: 'vehicles', label: 'Vehicles', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
                { id: 'pricing', label: 'Pricing', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  style={activeTab === tab.id ? { borderBottomColor: '#39B54A', color: '#39B54A' } : {}}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: '#585656' }}>
                    About {expedition.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2">Experience</h4>
                        <p className="text-gray-600">
                          {expedition.total_deliveries > 0 
                            ? `Completed ${expedition.total_deliveries} successful deliveries`
                            : 'New expedition service, ready to serve you'
                          }
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2">Service Area</h4>
                        <p className="text-gray-600">Based in {expedition.company_address}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2">Rating</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(expedition.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-gray-600">
                            {expedition.rating > 0 ? `${expedition.rating}/5` : 'No ratings yet'}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2">Joined</h4>
                        <p className="text-gray-600">
                          {new Date(expedition.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vehicles Tab */}
            {activeTab === 'vehicles' && (
              <div>
                <h3 className="text-xl font-semibold mb-6" style={{ color: '#585656' }}>
                  Available Vehicles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vehicles.map((vehicle, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <div className="flex items-start space-x-4">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: '#39B54A' }}
                        >
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-lg mb-2">{vehicle}</h4>
                          <p className="text-gray-600 text-sm">
                            Suitable for various cargo types and delivery distances
                          </p>
                          <div className="mt-3">
                            <span 
                              className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: 'rgba(183, 234, 181, 0.7)', 
                                color: '#585656' 
                              }}
                            >
                              Available
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <div>
                <h3 className="text-xl font-semibold mb-6" style={{ color: '#585656' }}>
                  Pricing Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: '#39B54A' }}
                      >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-800 text-lg mb-2">Base Fee</h4>
                      <p className="text-3xl font-bold mb-2" style={{ color: '#39B54A' }}>
                        {formatPrice(pricing.base_fee)}
                      </p>
                      <p className="text-gray-600 text-sm">Starting price for any delivery</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: '#7ED957' }}
                      >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-800 text-lg mb-2">Per Kilometer</h4>
                      <p className="text-3xl font-bold mb-2" style={{ color: '#7ED957' }}>
                        {formatPrice(pricing.per_km)}
                      </p>
                      <p className="text-gray-600 text-sm">Additional cost per km</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: '#F3FF09', color: '#585656' }}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-800 text-lg mb-2">Extra Handling</h4>
                      <p className="text-3xl font-bold mb-2" style={{ color: '#F3FF09', filter: 'brightness(0.8)' }}>
                        {formatPrice(pricing.extra_handling)}
                      </p>
                      <p className="text-gray-600 text-sm">Special handling charges</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-2">Pricing Example</h4>
                  <p className="text-blue-700">
                    For a 10km delivery with special handling: <br/>
                    Base Fee ({formatPrice(pricing.base_fee)}) + Distance (10km × {formatPrice(pricing.per_km)}) + Extra Handling ({formatPrice(pricing.extra_handling)}) = <strong>{formatPrice(pricing.base_fee + (10 * pricing.per_km) + pricing.extra_handling)}</strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#585656' }}>
              Book {expedition.name}
            </h3>
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={expedition.profile_picture || '/api/placeholder/60/60'}
                  alt={`${expedition.name} profile`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{expedition.name}</h4>
                  <p className="text-sm text-gray-600">{expedition.phone_number}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold text-gray-700 mb-2">Starting Prices:</h5>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Base Fee:</span> {formatPrice(pricing.base_fee)}</p>
                  <p><span className="font-medium">Per KM:</span> {formatPrice(pricing.per_km)}</p>
                  <p><span className="font-medium">Extra Handling:</span> {formatPrice(pricing.extra_handling)}</p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              You will be redirected to the booking form to provide pickup details, destination, and schedule your delivery.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  // Add booking logic here
                  console.log('Proceeding to book with:', expedition.name);
                  setShowBookingModal(false);
                }}
                className="flex-1 px-4 py-2 text-white font-medium rounded-md hover:opacity-90 transition-opacity duration-200"
                style={{ backgroundColor: '#39B54A' }}
              >
                Proceed to Booking
              </button>
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailExpedition;