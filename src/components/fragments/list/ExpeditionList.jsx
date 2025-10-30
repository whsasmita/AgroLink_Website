import ExpeditionCard from '../../compound/card/ExpeditionCard';

const ExpeditionList = ({ expeditions, loading, error, onSelectExpedition, onViewDetails }) => {
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

  if (!expeditions || expeditions.length === 0) {
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-700">Tidak Ada Ekspedisi Tersedia</h3>
        <p className="mb-4 text-gray-500">
          Kami tidak dapat menemukan layanan ekspedisi saat ini. Silakan coba lagi nanti atau periksa kembali segera.
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
            Ekspedisi Tersedia
          </h2>
          <p className="text-sm" style={{ color: '#585656' }}>
            {expeditions.length} ekspedisi{expeditions.length !== 1 ? 's' : ''} ditemukan
          </p>
        </div>
        
        {/* Filter/Sort Options (placeholder for future enhancement) */}
        <div className="flex hidden space-x-2">
          <select className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50" style={{ focusRingColor: '#39B54A' }}>
            <option value="rating">Urutkan berdasarkan Rating</option>
            <option value="price">Urutkan berdasarkan Harga</option>
            <option value="deliveries">Urutkan berdasarkan Pengalaman</option>
          </select>
        </div>
      </div>

      <div className='flex'>
        <select className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50" style={{ focusRingColor: '#39B54A' }}>
          <option value="rating">Urutkan berdasarkan Rating</option>
          <option value="price">Urutkan berdasarkan Harga</option>
          <option value="deliveries">Urutkan berdasarkan Pengalaman</option>
        </select>
      </div>

      {/* Expedition Cards Grid */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {expeditions.map((expedition, index) => (
          <ExpeditionCard
            key={expedition.user_id || index}
            expedition={expedition}
            onSelect={() => onSelectExpedition && onSelectExpedition(expedition)}
            onViewDetails={() => onViewDetails && onViewDetails(expedition)}
          />
        ))}
      </div>

      {/* Pagination Placeholder */}
      {expeditions.length >= 10 && (
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
            Berikutnya
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpeditionList;