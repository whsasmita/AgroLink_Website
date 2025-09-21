import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getExpeditionById } from "../../../services/expeditionService";
import AuthModal from '../../../components/compound/modal/AuthModal';

// Skeleton Components
const SkeletonLine = ({ width = "100%", height = "16px" }) => (
  <div 
    className="bg-gray-200 rounded animate-pulse" 
    style={{ width, height }}
  ></div>
);

const SkeletonAvatar = ({ size = "80px" }) => (
  <div 
    className="bg-gray-200 rounded-full animate-pulse flex-shrink-0" 
    style={{ width: size, height: size }}
  ></div>
);

const SkeletonCard = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

const ExpeditionSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Header Skeleton */}
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div>
              <SkeletonLine width="200px" height="32px" />
              <div className="mt-2">
                <SkeletonLine width="300px" height="20px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Main Content Skeleton */}
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Info Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card Skeleton */}
          <SkeletonCard>
            <div className="flex items-start space-x-4">
              <SkeletonAvatar />
              <div className="flex-1 space-y-3">
                <SkeletonLine width="250px" height="28px" />
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                  <SkeletonLine width="150px" height="16px" />
                </div>
              </div>
            </div>
          </SkeletonCard>

          {/* Contact Information Skeleton */}
          <SkeletonCard>
            <SkeletonLine width="180px" height="20px" />
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <SkeletonLine width="120px" height="16px" />
                  <SkeletonLine width="200px" height="16px" />
                </div>
              </div>
            </div>
          </SkeletonCard>

          {/* Vehicle Types Skeleton */}
          <SkeletonCard>
            <SkeletonLine width="160px" height="20px" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-100 border rounded-lg p-3 text-center animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-2"></div>
                  <SkeletonLine width="60px" height="14px" />
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Pricing Card Skeleton */}
          <SkeletonCard className="sticky top-4">
            <SkeletonLine width="140px" height="20px" />
            
            <div className="space-y-4 mt-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <SkeletonLine width="80px" height="14px" />
                  <SkeletonLine width="100px" height="16px" />
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </SkeletonCard>

          {/* Stats Card Skeleton */}
          <SkeletonCard>
            <SkeletonLine width="80px" height="20px" />
            <div className="space-y-3 mt-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex justify-between">
                  <SkeletonLine width="120px" height="16px" />
                  <SkeletonLine width="40px" height="16px" />
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  </div>
);

const DetailExpedition = () => {
  const { expeditionId } = useParams();
  const navigate = useNavigate();
  const [expedition, setExpedition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExpedition, setSelectedExpedition] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Format pricing function
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const fetchExpeditionDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getExpeditionById(expeditionId);
        setExpedition(response);
      } catch (err) {
        setError("Gagal memuat detail ekspedisi. Silakan coba lagi.");
        console.error("Error fetching expedition detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (expeditionId) {
      fetchExpeditionDetail();
    }
  }, [expeditionId]);

  const handleSelectExpedition = () => {
    // Cek apakah user sudah login (Anda bisa sesuaikan dengan sistem auth Anda)
    const isUserLoggedIn = localStorage.getItem('user_token'); // Contoh pengecekan
    
    if (isUserLoggedIn) {
      // Jika sudah login, tampilkan modal pilih ekspedisi seperti biasa
      setSelectedExpedition(expedition);
    } else {
      // Jika belum login, tampilkan modal auth
      setIsAuthModalOpen(true);
    }
  };

  if (loading) {
    return <ExpeditionSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <Link
            to="/expedition"
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Kembali ke Daftar Ekspedisi
          </Link>
        </div>
      </div>
    );
  }

  if (!expedition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Ekspedisi tidak ditemukan</p>
          <Link
            to="/expedition"
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Kembali ke Daftar Ekspedisi
          </Link>
        </div>
      </div>
    );
  }

  // Parse JSON data
  const pricing = JSON.parse(expedition.pricing_scheme);
  const vehicles = JSON.parse(expedition.vehicle_types);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/worker')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-3xl font-bold" style={{ color: '#585656' }}>
                    Detail Ekspedisi
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Informasi lengkap tentang jasa ekspedisi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={expedition.profile_picture || "/api/placeholder/80/80"}
                  alt={`${expedition.name} profile`}
                  className="w-20 h-20 rounded-full object-cover border-4 border-green-100"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {expedition.name}
                  </h2>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(expedition.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        {expedition.rating}/5 ({expedition.total_deliveries}{" "}
                        pengiriman)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informasi Ekspedisi
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-green-600"
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
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Alamat Kantor</p>
                    <p className="text-gray-600">
                      {expedition.company_address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Types */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Kendaraan Tersedia
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {vehicles.map((vehicle, index) => (
                  <div
                    key={index}
                    className="bg-green-50 border border-green-200 rounded-lg p-3 text-center"
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {vehicle}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informasi Harga
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Biaya Dasar</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(pricing.base_fee)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Per Kilometer</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(pricing.per_km)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">
                    Penanganan Ekstra
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(pricing.extra_handling)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button 
                  onClick={handleSelectExpedition}
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Pilih Ekspedisi Ini
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Statistik
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Pengiriman</span>
                  <span className="font-semibold">
                    {expedition.total_deliveries}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-semibold">{expedition.rating}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jenis Kendaraan</span>
                  <span className="font-semibold">{vehicles.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Modal */}
      {selectedExpedition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Pilih Ekspedisi
            </h3>
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={selectedExpedition.profile_picture || "/api/placeholder/48/48"}
                  alt={`${selectedExpedition.name} profile`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{selectedExpedition.name}</h4>
                  <p className="text-sm text-gray-600">{selectedExpedition.company_address}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Biaya Dasar:</strong> {formatPrice(pricing.base_fee)}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Per Kilometer:</strong> {formatPrice(pricing.per_km)}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Penanganan Ekstra:</strong> {formatPrice(pricing.extra_handling)}
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Anda akan menggunakan jasa ekspedisi <strong>{selectedExpedition.name}</strong> untuk pengiriman Anda.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  console.log('Proceeding with expedition:', selectedExpedition.name);
                  setSelectedExpedition(null);
                }}
                className="flex-1 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors"
              >
                Lanjutkan Pemilihan
              </button>
              <button
                onClick={() => setSelectedExpedition(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default DetailExpedition;