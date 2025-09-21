import { useState, useEffect } from 'react';
import WorkerList from '../../../components/fragments/list/WorkerList';
import { getWorkers } from '../../../services/workerService';

const ListWorker = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    total_pages: 1,
    total_records: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [allWorkers, setAllWorkers] = useState([]);

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
            limit: 10,
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
          limit: 10,
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
        const skills = JSON.parse(worker.skills);
        return (
          worker.name.toLowerCase().includes(query.toLowerCase()) ||
          worker.email.toLowerCase().includes(query.toLowerCase()) ||
          worker.address.toLowerCase().includes(query.toLowerCase()) ||
          skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
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
    const experiencedWorkers = workers.filter(w => w.total_jobs_completed > 0).length;
    const averageHourlyRate = workers.length > 0 
      ? workers.reduce((sum, w) => sum + w.hourly_rate, 0) / workers.length 
      : 0;
    const availableToday = workers.filter(w => {
      const schedule = JSON.parse(w.availability_schedule);
      // const today = new Date().toLocaleLowerCase();
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const todayName = dayNames[new Date().getDay()];
      return schedule.hasOwnProperty(todayName);
    }).length;

    return { totalWorkers, experiencedWorkers, averageHourlyRate, availableToday };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F4F4' }}>
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#585656' }}>
                Temukan Pekerja Anda
              </h1>
              <p className="text-gray-600 mt-2">
                Hubungkan dengan pekerja pertanian terampil untuk proyek pertanian Anda
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
                  placeholder="Cari pekerja pertanian..."
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

      <div className="container mx-auto px-4 py-8">
        {/* <nav className="flex mb-6" aria-label="Breadcrumb">
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
                  Pekerja
                </span>
              </div>
            </li>
          </ol>
        </nav> */}

        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
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
                <p className="text-sm font-medium text-gray-600">Berpengalaman</p>
                <p className="text-lg font-semibold" style={{ color: '#585656' }}>
                  {stats.experiencedWorkers}
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
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#585656' }}>
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
                    <div 
                      className="w-full h-full flex items-center justify-center text-white text-lg font-bold"
                      style={{ backgroundColor: '#39B54A' }}
                    >
                      {selectedWorker.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{selectedWorker.name}</h4>
                  <p className="text-sm text-gray-600">{selectedWorker.email}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Tarif Per Jam:</strong> {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  }).format(selectedWorker.hourly_rate)}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Tarif Per Hari:</strong> {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  }).format(selectedWorker.daily_rate)}
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Anda akan segera merekrut <strong>{selectedWorker.name}</strong> untuk proyek pertanian Anda.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  console.log('Proceeding to hire:', selectedWorker.name);
                  setSelectedWorker(null);
                }}
                className="flex-1 px-4 py-2 text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity duration-200"
                style={{ backgroundColor: '#39B54A' }}
              >
                Lanjutkan Merekrut
              </button>
              <button
                onClick={() => setSelectedWorker(null)}
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

export default ListWorker;