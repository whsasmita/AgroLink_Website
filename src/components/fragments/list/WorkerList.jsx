import WorkerCard from '../../compound/card/WorkerCard';

const WorkerList = ({ workers, loading, error, onHireWorker, onViewProfile }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg shadow-md animate-pulse">
            <div className="flex items-start mb-4 space-x-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="w-3/4 h-5 mb-2 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-4 mb-2 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-4 bg-gray-300 rounded"></div>
              <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
              <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center border border-red-200 rounded-lg bg-red-50">
        <div className="flex items-center justify-center mb-3">
          <svg 
            className="w-8 h-8 text-red-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-red-800">Waduh! Sedang terjadi masalah</h3>
        <p className="mb-4 text-red-600">{error}</p>
        <button 
          className="px-4 py-2 text-sm font-medium text-white transition-opacity duration-200 rounded-md hover:opacity-90"
          style={{ backgroundColor: '#B53939' }}
          onClick={() => window.location.reload()}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!workers || workers.length === 0) {
    return (
      <div className="p-8 text-center border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex items-center justify-center mb-4">
          <svg 
            className="w-12 h-12 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-700">Tidak Ada Pekerja Tersedia</h3>
        <p className="mb-4 text-gray-500">
          Kami tidak dapat menemukan pekerja saat ini. Silakan coba lagi nanti atau periksa kembali segera.
        </p>
        <button 
          className="px-6 py-2 text-sm font-medium text-white transition-opacity duration-200 rounded-md hover:opacity-90"
          style={{ backgroundColor: '#39B54A' }}
          onClick={() => window.location.reload()}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* List Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#585656' }}>
            Pekerja Tersedia
          </h2>
          <p className="text-sm" style={{ color: '#585656' }}>
            {workers.length} pekerja{workers.length !== 1 ? 's' : ''} ditemukan
          </p>
        </div>
        
        {/* Filter/Sort Options */}
        <div className="flex hidden space-x-2 ">
          <select className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50" style={{ focusRingColor: '#39B54A' }}>
            <option value="rating">Urutkan berdasarkan Rating</option>
            <option value="hourly_rate">Urutkan berdasarkan Tarif Per Jam</option>
            <option value="daily_rate">Urutkan berdasarkan Tarif Per Hari</option>
            <option value="experience">Urutkan berdasarkan Pengalaman</option>
          </select>
          <select className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50" style={{ focusRingColor: '#39B54A' }}>
            <option value="">Semua Keterampilan</option>
            <option value="coffee">Terkait Kopi</option>
            <option value="farming">Pertanian</option>
            <option value="machinery">Mesin</option>
          </select>
        </div>
      </div>

      <div className='flex-col'>
        <select className="px-3 py-2 mb-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50" style={{ focusRingColor: '#39B54A' }}>
            <option value="rating">Urutkan berdasarkan Rating</option>
            <option value="hourly_rate">Urutkan berdasarkan Tarif Per Jam</option>
            <option value="daily_rate">Urutkan berdasarkan Tarif Per Hari</option>
            <option value="experience">Urutkan berdasarkan Pengalaman</option>
        </select>
        <select className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50" style={{ focusRingColor: '#39B54A' }}>
          <option value="">Semua Keterampilan</option>
          <option value="coffee">Terkait Kopi</option>
          <option value="farming">Pertanian</option>
          <option value="machinery">Mesin</option>
        </select>
      </div>

      {/* Worker Cards Grid */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {workers.map((worker, index) => (
          <WorkerCard
            key={worker.user_id || index}
            worker={worker}
            onHire={() => onHireWorker && onHireWorker(worker)}
            onViewProfile={() => onViewProfile && onViewProfile(worker)}
          />
        ))}
      </div>

      {/* Quick Stats */}
      {/* <div className="grid grid-cols-1 gap-4 p-4 mt-8 bg-white rounded-lg shadow-sm md:grid-cols-4">
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: '#39B54A' }}>
            {workers.filter(w => w.rating >= 4).length}
          </div>
          <div className="text-sm text-gray-600">Teratas</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: '#7ED957' }}>
            {workers.filter(w => w.total_jobs_completed > 0).length}
          </div>
          <div className="text-sm text-gray-600">Berpengalaman</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: '#F3FF09', filter: 'brightness(0.8)' }}>
            {workers.filter(w => {
              const schedule = JSON.parse(w.availability_schedule);
              return Object.keys(schedule).length >= 5;
            }).length}
          </div>
          <div className="text-sm text-gray-600">Jadwal Fleksibel</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: '#36FF09', filter: 'brightness(0.6)' }}>
            {workers.filter(w => w.current_location_lat && w.current_location_lng).length}
          </div>
          <div className="text-sm text-gray-600">Lokasi</div>
        </div>
      </div> */}

      {/* Pagination Placeholder */}
      {workers.length >= 10 && (
        <div className="flex items-center justify-center mt-8 space-x-2">
          <button className="px-3 py-2 text-sm transition-colors duration-200 border border-gray-300 rounded-md hover:bg-gray-50">
            Sebelumnya
          </button>
          <div className="flex space-x-1">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                  page === 1 
                    ? 'text-white' 
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
                style={page === 1 ? { backgroundColor: '#39B54A' } : {}}
              >
                {page}
              </button>
            ))}
          </div>
          <button className="px-3 py-2 text-sm transition-colors duration-200 border border-gray-300 rounded-md hover:bg-gray-50">
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkerList;