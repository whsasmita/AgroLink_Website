import { useState } from 'react';
import AuthModal from '../modal/AuthModal';
import { useNavigate } from 'react-router-dom';

const WorkerCard = ({ worker }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const { 
    user_id: id,
    name, 
    profile_picture, 
    skills,
    hourly_rate,
    daily_rate,
    address, 
    availability_schedule,
    rating, 
    total_jobs_completed 
  } = worker;

  // Parse JSON strings with error handling
  const parseJSON = (jsonString, fallback = {}) => {
    try {
      return jsonString ? JSON.parse(jsonString) : fallback;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return fallback;
    }
  };

  const workerSkills = parseJSON(skills, []);
  const schedule = parseJSON(availability_schedule, {});

  // Format pricing
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Get available days
  const getAvailableDays = () => {
    const days = {
      monday: 'Sen', tuesday: 'Sel', wednesday: 'Rab', 
      thursday: 'Kam', friday: 'Jum', saturday: 'Sab', sunday: 'Min'
    };
    
    // Check if schedule exists and is an object
    if (!schedule || typeof schedule !== 'object') {
      return [];
    }
    
    return Object.keys(schedule).map(day => days[day] || day);
  };

  // Navigate to detail page
  const handleProfileClick = () => {
    navigate(`/worker/${id}`);
  };

  // Function untuk handle klik rekrut worker
  const handleRecruitWorker = () => {
    // Cek apakah user sudah login (Anda bisa sesuaikan dengan sistem auth Anda)
    const isUserLoggedIn = localStorage.getItem('token'); // Contoh pengecekan
    
    if (isUserLoggedIn) {
      // Jika sudah login, lakukan aksi rekrut worker
      console.log('User sudah login, proses rekrut worker');
      // Tambahkan logic untuk merekrut worker di sini
      // Misalnya navigate ke halaman booking atau form pemesanan
      navigate(`/book-worker/${id}`);
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
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
              {profile_picture ? (
                <img
                  src={profile_picture}
                  alt={`${name} profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center text-white text-lg font-bold"
                  style={{ backgroundColor: '#39B54A' }}
                >
                  {name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 mb-1">{name || 'Nama tidak tersedia'}</h3>
            <div className="flex items-center space-x-2 mb-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-600 ml-1">
                  ({rating || 0}/5)
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600">{total_jobs_completed || 0} pekerjaan</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-3 bg-gray-50 p-2 rounded-md">
          <div className="flex items-start">
            <svg className="w-3 h-3 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs text-gray-700 line-clamp-2">{address || 'Alamat tidak tersedia'}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Keahlian:</h4>
          <div className="flex flex-wrap gap-1">
            {workerSkills.length > 0 ? (
              workerSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full font-medium"
                  style={{ 
                    backgroundColor: 'rgba(183, 234, 181, 0.7)', 
                    color: '#585656' 
                  }}
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">Tidak ada keahlian</span>
            )}
          </div>
        </div>

        {/* Availability */}
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Tersedia:</h4>
          <div className="flex flex-wrap gap-1">
            {getAvailableDays().length > 0 ? (
              getAvailableDays().map((day, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium"
                >
                  {day}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">Jadwal tidak tersedia</span>
            )}
          </div>
          {schedule && Object.entries(schedule)[0] && (
            <div className="mt-1 text-xs text-gray-600">
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="truncate">{Object.entries(schedule)[0][1]}</span>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Information */}
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Tarif:</h4>
          <div className="grid grid-cols-2 gap-1">
            <div className="bg-gray-50 p-2 rounded text-center">
              <p className="text-xs text-gray-600">Per Jam</p>
              <p className="text-xs font-semibold text-gray-800">
                {hourly_rate ? formatPrice(hourly_rate) : 'Tidak tersedia'}
              </p>
            </div>
            <div className="bg-gray-50 p-2 rounded text-center">
              <p className="text-xs text-gray-600">Per Hari</p>
              <p className="text-xs font-semibold text-gray-800">
                {daily_rate ? formatPrice(daily_rate) : 'Tidak tersedia'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleRecruitWorker}
            className="flex-1 px-3 py-2 text-white text-xs font-medium rounded-md hover:opacity-90 transition-opacity duration-200"
            style={{ backgroundColor: '#39B54A' }}
          >
            Rekrut
          </button>
          <button
            onClick={handleProfileClick}
            className="px-3 py-2 border border-gray-300 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Profil
          </button>
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

export default WorkerCard;