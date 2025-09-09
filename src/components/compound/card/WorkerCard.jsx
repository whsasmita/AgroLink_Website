import React from 'react';

const WorkerCard = ({ worker }) => {
  const { 
    name, 
    email,
    profile_picture, 
    phone_number, 
    skills,
    hourly_rate,
    daily_rate,
    address, 
    availability_schedule,
    current_location_lat,
    current_location_lng,
    rating, 
    total_jobs_completed 
  } = worker;

  // Parse JSON strings
  const workerSkills = JSON.parse(skills);
  const schedule = JSON.parse(availability_schedule);

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
    return Object.keys(schedule).map(day => days[day]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
      {/* Header Section */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
            {profile_picture ? (
              <img
                src={profile_picture}
                alt={`${name} profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center text-white text-xl font-bold"
                style={{ backgroundColor: '#39B54A' }}
              >
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-gray-600 ml-1">
                ({rating}/5)
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">{total_jobs_completed} pekerjaan selesai</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mb-4 bg-gray-50 p-3 rounded-md">
        <div className="flex items-center mb-2">
          <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="text-sm text-gray-700">{phone_number}</span>
        </div>
        <div className="flex items-center mb-2">
          <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
          <span className="text-sm text-gray-700">{email}</span>
        </div>
        <div className="flex items-start">
          <svg className="w-4 h-4 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm text-gray-700">{address}</span>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Keahlian:</h4>
        <div className="flex flex-wrap gap-2">
          {workerSkills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs rounded-full font-medium"
              style={{ 
                backgroundColor: 'rgba(183, 234, 181, 0.7)', 
                color: '#585656' 
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Hari Tersedia:</h4>
        <div className="flex flex-wrap gap-1">
          {getAvailableDays().map((day, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium"
            >
              {day}
            </span>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-600">
          <div className="flex items-center">
            <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {Object.entries(schedule)[0] && `${Object.entries(schedule)[0][1]}`}
          </div>
        </div>
      </div>

      {/* Pricing Information */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Tarif:</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs text-gray-600">Tarif Per Jam</p>
            <p className="text-sm font-semibold text-gray-800">{formatPrice(hourly_rate)}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs text-gray-600">Tarif Per Hari</p>
            <p className="text-sm font-semibold text-gray-800">{formatPrice(daily_rate)}</p>
          </div>
        </div>
      </div>

      {/* Location Badge */}
      {(current_location_lat && current_location_lng) && (
        <div className="mb-4">
          <div className="flex items-center text-xs text-gray-600">
            <svg className="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>Lokasi</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          className="flex-1 px-4 py-2 text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity duration-200"
          style={{ backgroundColor: '#39B54A' }}
        >
          Rekrut Pekerja
        </button>
        <button
          className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          Lihat Profil
        </button>
      </div>
    </div>
  );
};

export default WorkerCard;