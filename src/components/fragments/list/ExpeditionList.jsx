import React from 'react';
import ExpeditionCard from '../../compound/card/ExpeditionCard';

const ExpeditionList = ({ expeditions, loading, error, onSelectExpedition, onViewDetails }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-pulse">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-300 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
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
        <h3 className="text-lg font-semibold text-red-800 mb-2">Waduh! Sedang terjadi masalah</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          className="px-4 py-2 text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity duration-200"
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
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
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
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Tidak Ada Ekspedisi Tersedia</h3>
        <p className="text-gray-500 mb-4">
          Kami tidak dapat menemukan layanan ekspedisi saat ini. Silakan coba lagi nanti atau periksa kembali segera.
        </p>
        <button 
          className="px-6 py-2 text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity duration-200"
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
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50" style={{ focusRingColor: '#39B54A' }}>
            <option value="rating">Urutkan berdasarkan Rating</option>
            <option value="price">Urutkan berdasarkan Harga</option>
            <option value="deliveries">Urutkan berdasarkan Pengalaman</option>
          </select>
        </div>
      </div>

      {/* Expedition Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors duration-200">
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
          <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors duration-200">
            Berikutnya
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpeditionList;