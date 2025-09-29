import { useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "../modal/AuthModal"; 

const ExpeditionCard = ({ expedition }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const {
    id, // Pastikan ini adalah ID expedition yang benar
    user_id, // ID pengguna/driver
    name,
    profile_picture,
    phone_number,
    company_address,
    pricing_scheme,
    vehicle_types,
    rating,
    total_deliveries,
  } = expedition;

  // Parse JSON strings with error handling
  let pricing = {};
  let vehicles = [];
  
  try {
    pricing = pricing_scheme ? JSON.parse(pricing_scheme) : {};
  } catch (error) {
    console.error('Error parsing pricing_scheme:', error);
    pricing = {};
  }
  
  try {
    // Add more detailed debugging
    console.log('vehicle_types raw:', vehicle_types);
    console.log('vehicle_types type:', typeof vehicle_types);
    
    if (vehicle_types === null || vehicle_types === undefined) {
      vehicles = [];
    } else if (typeof vehicle_types === 'string') {
      const parsed = JSON.parse(vehicle_types);
      vehicles = Array.isArray(parsed) ? parsed : [];
    } else if (Array.isArray(vehicle_types)) {
      vehicles = vehicle_types;
    } else {
      vehicles = [];
    }
  } catch (error) {
    console.error('Error parsing vehicle_types:', error);
    console.error('vehicle_types value was:', vehicle_types);
    vehicles = [];
  }
  
  // Final safety check
  if (!Array.isArray(vehicles)) {
    console.warn('vehicles is not an array, forcing to empty array:', vehicles);
    vehicles = [];
  }

  // Format pricing
  const formatPrice = (price) => {
    if (!price || isNaN(price)) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Gunakan id expedition atau user_id sesuai dengan struktur data Anda
  const expeditionId = id || user_id;

  // Function untuk handle klik pilih ekspedisi
  const handleSelectExpedition = () => {
    // Cek apakah user sudah login (Anda bisa sesuaikan dengan sistem auth Anda)
    const isUserLoggedIn = localStorage.getItem('token'); // Contoh pengecekan
    
    if (isUserLoggedIn) {
      // Jika sudah login, lakukan aksi pilih ekspedisi
      console.log('User sudah login, proses pilih ekspedisi');
      // Tambahkan logic untuk memilih ekspedisi di sini
    } else {
      // Jika belum login, tampilkan modal auth
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-300 max-w-sm">
        {/* Header Section */}
        <div className="flex items-start space-x-3 mb-3">
          <div className="flex-shrink-0">
            <img
              src={profile_picture || "/api/placeholder/60/60"}
              alt={`${name || 'User'} profile`}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 mb-1">{name || 'Unknown'}</h3>
            <div className="flex items-center space-x-2 mb-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(rating || 0) ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-600 ml-1">({rating || 0}/5)</span>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              {total_deliveries || 0} pengiriman
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-3 bg-gray-50 p-2 rounded-md">
          <div className="flex items-start">
            <svg
              className="w-3 h-3 text-gray-500 mr-2 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-xs text-gray-700 line-clamp-2">
              {company_address || 'Alamat tidak tersedia'}
            </span>
          </div>
        </div>

        {/* Vehicle Types */}
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">
            Mobil Tersedia:
          </h4>
          <div className="flex flex-wrap gap-1">
            {Array.isArray(vehicles) && vehicles.length > 0 ? (
              vehicles.map((vehicle, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full font-medium"
                  style={{
                    backgroundColor: "rgba(183, 234, 181, 0.7)",
                    color: "#585656",
                  }}
                >
                  {vehicle || 'Unknown Vehicle'}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500 italic">
                Tidak ada data kendaraan
              </span>
            )}
          </div>
        </div>

        {/* Pricing Information */}
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Harga:</h4>
          <div className="grid grid-cols-3 gap-1">
            <div className="bg-gray-50 p-2 rounded text-center">
              <p className="text-xs text-gray-600">Awal</p>
              <p className="text-xs font-semibold text-gray-800">
                {formatPrice(pricing.base_fee)}
              </p>
            </div>
            <div className="bg-gray-50 p-2 rounded text-center">
              <p className="text-xs text-gray-600">Per KM</p>
              <p className="text-xs font-semibold text-gray-800">
                {formatPrice(pricing.per_km)}
              </p>
            </div>
            <div className="bg-gray-50 p-2 rounded text-center">
              <p className="text-xs text-gray-600">Extra</p>
              <p className="text-xs font-semibold text-gray-800">
                {formatPrice(pricing.extra_handling)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleSelectExpedition}
            className="flex-1 px-3 py-2 text-white text-xs font-medium rounded-md hover:opacity-90 transition-opacity duration-200"
            style={{ backgroundColor: "#39B54A" }}
          >
            Pilih Ekspedisi
          </button>
          <Link
            to={`/expedition/${expeditionId}`}
            className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Detail
          </Link>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default ExpeditionCard;