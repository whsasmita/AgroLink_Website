import { useState, useEffect } from 'react';
import ExpeditionList from '../../../components/fragments/list/ExpeditionList';
import { getExpedition } from '../../../services/expeditionService';

const ListExpedition = () => {
  const [expeditions, setExpeditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    total_pages: 1,
    total_records: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpedition, setSelectedExpedition] = useState(null);

  const fetchExpeditions = async () => {
  try {
    setLoading(true);
    setError(null);

    const responseData = await getExpedition();

    setExpeditions(responseData.data || []); 
    
    if (responseData.pagination) {
      setPagination(responseData.pagination);
    }

  } catch (err) {
    setError('Gagal memuat data ekspedisi. Silakan coba lagi.');
    console.error('Error fetching expeditions:', err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchExpeditions();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      await fetchExpeditions();
    } else {
      const filteredExpeditions = expeditions.filter(expedition => 
        expedition.name.toLowerCase().includes(query.toLowerCase()) ||
        expedition.company_address.toLowerCase().includes(query.toLowerCase()) ||
        JSON.parse(expedition.vehicle_types).some(vehicle => 
          vehicle.toLowerCase().includes(query.toLowerCase())
        )
      );
      setExpeditions(filteredExpeditions);
    }
  };

  const handleSelectExpedition = (expedition) => {
    setSelectedExpedition(expedition);
    console.log('Selected expedition:', expedition);
  };

  const handleViewDetails = (expedition) => {
    console.log('View details for:', expedition);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F4F4' }}>
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#585656' }}>
                Temukan Ekspedisi Anda
              </h1>
              <p className="text-gray-600 mt-2">
                Pilih dari mitra ekspedisi terpercaya kami untuk kebutuhan pengiriman Anda
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex-shrink-0 lg:w-96">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg 
                    className="h-5 w-5 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cari ekspedisi di sini..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                  style={{ 
                    focusRingColor: '#39B54A',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a 
                href="/" 
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Beranda
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg 
                  className="w-6 h-6 text-gray-400" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  Ekspedisi
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#39B54A' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Pengiriman</p>
                <p className="text-lg font-semibold" style={{ color: '#585656' }}>
                  {pagination.total_records}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#7ED957' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Mitra Terverifikasi</p>
                <p className="text-lg font-semibold" style={{ color: '#585656' }}>
                  {expeditions.filter(exp => exp.rating >= 4).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#F3FF09', color: '#585656' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Rata-rata Respon</p>
                <p className="text-lg font-semibold" style={{ color: '#585656' }}>
                  {'< 1 Jam'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#36FF09', color: '#585656' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Mulai Dari</p>
                <p className="text-lg font-semibold" style={{ color: '#585656' }}>
                  Rp 50.000
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Expedition List */}
        <ExpeditionList
          expeditions={expeditions}
          loading={loading}
          error={error}
          onSelectExpedition={handleSelectExpedition}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* Selected Expedition Modal/Alert (optional) */}
      {selectedExpedition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#585656' }}>
              Ekspedisi Dipilih
            </h3>
            <p className="text-gray-600 mb-4">
              Anda telah memilih <strong>{selectedExpedition.name}</strong> sebagai mitra ekspedisi Anda.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  // Add booking logic here
                  console.log('Proceeding to book with:', selectedExpedition.name);
                  setSelectedExpedition(null);
                }}
                className="flex-1 px-4 py-2 text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity duration-200"
                style={{ backgroundColor: '#39B54A' }}
              >
                Lanjutkan Pemesanan
              </button>
              <button
                onClick={() => setSelectedExpedition(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListExpedition;