import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkerById } from '../../../services/workerService';
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

const WorkerSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Header Skeleton */}
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div>
                <SkeletonLine width="180px" height="32px" />
                <div className="mt-2">
                  <SkeletonLine width="280px" height="20px" />
                </div>
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
                <SkeletonLine width="220px" height="28px" />
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                  <SkeletonLine width="140px" height="16px" />
                </div>
              </div>
            </div>
          </SkeletonCard>

          {/* Contact Information Skeleton */}
          <SkeletonCard>
            <SkeletonLine width="160px" height="20px" />
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start space-x-3 md:col-span-2">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <SkeletonLine width="80px" height="16px" />
                  <SkeletonLine width="250px" height="16px" />
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
                    <SkeletonLine width="150px" height="14px" />
                  </div>
                </div>
              </div>
            </div>
          </SkeletonCard>

          {/* Skills Skeleton */}
          <SkeletonCard>
            <SkeletonLine width="100px" height="20px" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-100 border rounded-lg p-3 text-center animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-2"></div>
                  <SkeletonLine width="80px" height="14px" />
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Schedule Skeleton */}
          <SkeletonCard>
            <SkeletonLine width="180px" height="20px" />
            <div className="space-y-3 mt-4">
              {[...Array(7)].map((_, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <SkeletonLine width="60px" height="16px" />
                  <div className="bg-gray-200 px-3 py-1 rounded-full animate-pulse">
                    <SkeletonLine width="80px" height="14px" />
                  </div>
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
              {[...Array(2)].map((_, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <SkeletonLine width="90px" height="14px" />
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
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex justify-between">
                  <SkeletonLine width="110px" height="16px" />
                  <SkeletonLine width="50px" height="16px" />
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  </div>
);

const DetailWorker = () => {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Helper function untuk parsing JSON dengan error handling
  const parseJSON = (jsonString, fallback = null) => {
    try {
      return jsonString ? JSON.parse(jsonString) : fallback;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return fallback;
    }
  };

  // Format pricing function
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  useEffect(() => {
    const fetchWorkerDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getWorkerById(workerId);
        setWorker(response);
      } catch (err) {
        setError(err.message || 'Gagal memuat detail pekerja. Silakan coba lagi.');
        console.error('Error fetching worker details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (workerId) {
      fetchWorkerDetail();
    }
  }, [workerId]);

  if (loading) {
    return <WorkerSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate('/worker')}
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Kembali ke Daftar Pekerja
          </button>
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Pekerja tidak ditemukan</p>
          <button
            onClick={() => navigate('/worker')}
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Kembali ke Daftar Pekerja
          </button>
        </div>
      </div>
    );
  }

  // Parse JSON strings dengan error handling
  const workerSkills = parseJSON(worker.skills, []);
  const schedule = parseJSON(worker.availability_schedule, {});

  // Pastikan workerSkills adalah array
  const skillsArray = Array.isArray(workerSkills) ? workerSkills : [];

  // Get available days with time
  const getScheduleDetails = () => {
    const days = {
      monday: 'Senin', tuesday: 'Selasa', wednesday: 'Rabu', 
      thursday: 'Kamis', friday: 'Jumat', saturday: 'Sabtu', sunday: 'Minggu'
    };
    
    // Check jika schedule adalah object yang valid
    if (!schedule || typeof schedule !== 'object') {
      return [];
    }
    
    return Object.entries(schedule).map(([day, time]) => ({
      day: days[day] || day,
      time: time || 'Tidak tersedia'
    }));
  };

  const handleHireWorker = () => {
    // Cek apakah user sudah login (Anda bisa sesuaikan dengan sistem auth Anda)
    const isUserLoggedIn = localStorage.getItem('user_token'); // Contoh pengecekan
    
    if (isUserLoggedIn) {
      // Jika sudah login, tampilkan modal hire worker seperti biasa
      setSelectedWorker(worker);
    } else {
      // Jika belum login, tampilkan modal auth
      setIsAuthModalOpen(true);
    }
  };

  const scheduleDetails = getScheduleDetails();

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
                    Detail Pekerja
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Informasi lengkap tentang pekerja pertanian
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
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-green-100 flex-shrink-0">
                  {worker.profile_picture ? (
                    <img
                      src={worker.profile_picture}
                      alt={`${worker.name} profile`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-green-500 flex items-center justify-center text-white text-2xl font-bold">
                      {worker.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {worker.name || 'Nama tidak tersedia'}
                  </h2>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(worker.rating || 0)
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
                        {worker.rating || 0}/5 ({worker.total_jobs_completed || 0}{" "}
                        pekerjaan)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informasi Pekerja
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 md:col-span-2">
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
                    <p className="font-medium text-gray-900">Alamat</p>
                    <p className="text-gray-600">{worker.address || 'Alamat tidak tersedia'}</p>
                    {(worker.current_location_lat && worker.current_location_lng) && (
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">Lokasi aktif tersedia</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Keahlian
              </h3>
              {skillsArray.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {skillsArray.map((skill, index) => (
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Tidak ada keahlian yang tersedia</p>
              )}
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Jadwal Ketersediaan
              </h3>
              {scheduleDetails.length > 0 ? (
                <div className="space-y-3">
                  {scheduleDetails.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{item.day}</span>
                      <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Jadwal tidak tersedia</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informasi Tarif
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Tarif Per Jam</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(worker.hourly_rate)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Tarif Per Hari</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(worker.daily_rate)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button 
                  onClick={handleHireWorker}
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Rekrut Pekerja Ini
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
                  <span className="text-gray-600">Total Pekerjaan</span>
                  <span className="font-semibold">
                    {worker.total_jobs_completed || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-semibold">{worker.rating || 0}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Keahlian</span>
                  <span className="font-semibold">{skillsArray.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-semibold text-green-600">
                    {scheduleDetails.length > 0 ? 'Tersedia' : 'Tidak Tersedia'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hire Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Rekrut Pekerja
            </h3>
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                  {selectedWorker.profile_picture ? (
                    <img
                      src={selectedWorker.profile_picture}
                      alt={`${selectedWorker.name} profile`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-green-500 flex items-center justify-center text-white text-lg font-bold">
                      {selectedWorker.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{selectedWorker.name || 'Nama tidak tersedia'}</h4>
                  <p className="text-sm text-gray-600">{selectedWorker.email || 'Email tidak tersedia'}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Tarif Per Jam:</strong> {formatPrice(selectedWorker.hourly_rate)}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Tarif Per Hari:</strong> {formatPrice(selectedWorker.daily_rate)}
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Anda akan segera merekrut <strong>{selectedWorker.name || 'pekerja ini'}</strong> untuk proyek pertanian Anda.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  console.log('Proceeding to hire:', selectedWorker.name);
                  setSelectedWorker(null);
                }}
                className="flex-1 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors"
              >
                Lanjutkan Merekrut
              </button>
              <button
                onClick={() => setSelectedWorker(null)}
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

export default DetailWorker;