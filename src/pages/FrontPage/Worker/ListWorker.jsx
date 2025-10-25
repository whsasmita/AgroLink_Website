import { useState, useEffect } from 'react';
import WorkerList from '../../../components/fragments/list/WorkerList';
import { getWorkers } from '../../../services/workerService';

const ListWorker = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    total_pages: 1,
    total_records: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [allWorkers, setAllWorkers] = useState([]);

  // Helper function untuk parsing JSON dengan error handling
  const parseJSON = (jsonString, fallback = null) => {
    try {
      return jsonString ? JSON.parse(jsonString) : fallback;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return fallback;
    }
  };

  // Fetch workers data
  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getWorkers();
      
      if (response && response.data) {
        setWorkers(response.data);
        setAllWorkers(response.data); 
        if (response.pagination) {
          setPagination(response.pagination);
        } else {
          setPagination({
            limit: 20,
            offset: 0,
            total_pages: 1,
            total_records: response.data.length
          });
        }
      } else {
        const workerData = Array.isArray(response) ? response : [];
        setWorkers(workerData);
        setAllWorkers(workerData);
        setPagination({
          limit: 20,
          offset: 0,
          total_pages: 1,
          total_records: workerData.length
        });
      }
      
    } catch (err) {
      setError(err.message || 'Failed to load workers. Please try again.');
      console.error('Error fetching workers:', err);
      setWorkers([]);
      setAllWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setWorkers(allWorkers);
    } else {
      const filteredWorkers = allWorkers.filter(worker => {
        // Safe parsing untuk skills
        const skills = parseJSON(worker.skills, []);
        const skillsArray = Array.isArray(skills) ? skills : [];
        
        return (
          (worker?.name || "").toLowerCase().includes(query.toLowerCase()) ||
          (worker?.email || "").toLowerCase().includes(query.toLowerCase()) ||
          (worker?.address || "").toLowerCase().includes(query.toLowerCase()) ||
          skillsArray.some(skill => (skill || "").toLowerCase().includes(query.toLowerCase()))
        );
      });
      setWorkers(filteredWorkers);
    }
  };

  const handleHireWorker = (worker) => {
    setSelectedWorker(worker);
    console.log('Hiring worker:', worker);
  };

  const handleViewProfile = (worker) => {
    console.log('View profile for:', worker);
  };

  const calculateStats = () => {
    const totalWorkers = workers.length;
    const experiencedWorkers = workers.filter(w => (w.total_jobs_completed || 0) > 0).length;
    const averageHourlyRate = workers.length > 0 
      ? workers.reduce((sum, w) => sum + (w.hourly_rate || 0), 0) / workers.length 
      : 0;
    
    const availableToday = workers.filter(w => {
      // Safe parsing untuk schedule
      const schedule = parseJSON(w.availability_schedule, {});
      
      // Check jika schedule adalah object yang valid
      if (!schedule || typeof schedule !== 'object') {
        return false;
      }
      
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const todayName = dayNames[new Date().getDay()];
      
      return schedule.hasOwnProperty(todayName);
    }).length;

    return { totalWorkers, experiencedWorkers, averageHourlyRate, availableToday };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F4F4' }}>
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#585656' }}>
                Temukan Pekerja Anda
              </h1>
              <p className="mt-2 text-gray-600">
                Hubungkan dengan pekerja pertanian terampil untuk proyek pertanian Anda
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex-shrink-0 lg:w-96">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg 
                    className="w-5 h-5 text-gray-400" 
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
                  placeholder="Cari pekerja pertanian..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full py-2 pl-10 pr-3 leading-5 placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                  style={{ 
                    focusRingColor: '#39B54A',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto">
        {/* Stats Section - Uncommented for reference */}
        {/* <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div 
                  className="flex items-center justify-center w-8 h-8 rounded-full"
                  style={{ backgroundColor: '#39B54A' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Pekerja</p>
                <p className="text-lg font-semibold" style={{ color: '#585656' }}>
                  {stats.totalWorkers}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div 
                  className="flex items-center justify-center w-8 h-8 rounded-full"
                  style={{ backgroundColor: '#7ED957' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Berpengalaman</p>
                <p className="text-lg font-semibold" style={{ color: '#585656' }}>
                  {stats.experiencedWorkers}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div 
                  className="flex items-center justify-center w-8 h-8 rounded-full"
                  style={{ backgroundColor: '#F3FF09', color: '#585656' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Rata-rata Per Jam</p>
                <p className="text-lg font-semibold" style={{ color: '#585656' }}>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  }).format(stats.averageHourlyRate)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div 
                  className="flex items-center justify-center w-8 h-8 rounded-full"
                  style={{ backgroundColor: '#36FF09', color: '#585656' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Tersedia Hari Ini</p>
                <p className="text-lg font-semibold" style={{ color: '#585656' }}>
                  {stats.availableToday}
                </p>
              </div>
            </div>
          </div>
        </div> */}

        <WorkerList
          workers={workers}
          loading={loading}
          error={error}
          onHireWorker={handleHireWorker}
          onViewProfile={handleViewProfile}
        />
      </div>

      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 m-4 bg-white rounded-lg">
            <h3 className="mb-4 text-lg font-semibold" style={{ color: '#585656' }}>
              Rekrut Pekerja
            </h3>
            <div className="mb-4">
              <div className="flex items-center mb-3 space-x-3">
                <div className="w-12 h-12 overflow-hidden border-2 border-gray-200 rounded-full">
                  {selectedWorker.profile_picture ? (
                    <img
                      src={selectedWorker.profile_picture}
                      alt={`${selectedWorker?.name || 'worker'} profile`}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div 
                      className="flex items-center justify-center w-full h-full text-lg font-bold text-white"
                      style={{ backgroundColor: '#39B54A' }}
                    >
                      {selectedWorker?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{selectedWorker?.name || 'Nama tidak tersedia'}</h4>
                  <p className="text-sm text-gray-600">{selectedWorker.email || 'Email tidak tersedia'}</p>
                </div>
              </div>
              <div className="p-3 rounded-md bg-gray-50">
                <p className="mb-2 text-sm text-gray-700">
                  <strong>Tarif Per Jam:</strong> {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  }).format(selectedWorker.hourly_rate || 0)}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Tarif Per Hari:</strong> {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  }).format(selectedWorker.daily_rate || 0)}
                </p>
              </div>
            </div>
            <p className="mb-4 text-gray-600">
              Anda akan segera merekrut <strong>{selectedWorker?.name || 'pekerja ini'}</strong> untuk proyek pertanian Anda.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  console.log('Proceeding to hire:', selectedWorker?.name);
                  setSelectedWorker(null);
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-white transition-opacity duration-200 rounded-md hover:opacity-90"
                style={{ backgroundColor: '#39B54A' }}
              >
                Lanjutkan Merekrut
              </button>
              <button
                onClick={() => setSelectedWorker(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 border border-gray-300 rounded-md hover:bg-gray-50"
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

export default ListWorker;