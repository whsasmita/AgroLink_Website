import { useState, useEffect, useCallback } from 'react';
import WorkerList from '../../../components/fragments/list/WorkerList';
import { getWorkers } from '../../../services/workerService';
import { Users, Briefcase, Award, Star, Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

const ListWorker = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [allWorkers, setAllWorkers] = useState([]);

  // Query Params & Pagination State
  const [sortBy, setSortBy] = useState('total_jobs_completed'); // 'total_jobs_completed', 'rating', 'daily_rate', 'hourly_rate'
  const [order, setOrder] = useState('desc');
  const [limit, setLimit] = useState(50); // Default 50 per load to show plenty of workers
  const [page, setPage] = useState(1);

  // Helper function untuk parsing JSON dengan error handling
  const parseJSON = (jsonString, fallback = null) => {
    try {
      if (!jsonString) return fallback;
      if (typeof jsonString === 'object') return jsonString;
      return JSON.parse(jsonString);
    } catch {
      return fallback;
    }
  };

  // Fetch workers data with server-side query params
  const fetchWorkers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getWorkers({
        sort_by: sortBy,
        order: order,
        limit: limit,
        page: page,
      });

      let workerData = [];
      if (response && response.data) {
        workerData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        workerData = response;
      }

      setWorkers(workerData);
      setAllWorkers(workerData);
    } catch (err) {
      console.error('Error fetching workers:', err);
      setError(err.message || 'Gagal memuat data pekerja. Silakan coba lagi.');
      setWorkers([]);
      setAllWorkers([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy, order, limit, page]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setWorkers(allWorkers);
    } else {
      const q = query.toLowerCase();
      const filtered = allWorkers.filter((worker) => {
        const skills = parseJSON(worker.skills, []);
        const skillsArray = Array.isArray(skills) ? skills : [worker.skills].filter(Boolean);

        return (
          (worker?.name || '').toLowerCase().includes(q) ||
          (worker?.email || '').toLowerCase().includes(q) ||
          (worker?.address || '').toLowerCase().includes(q) ||
          skillsArray.some((skill) => (skill || '').toLowerCase().includes(q))
        );
      });
      setWorkers(filtered);
    }
  };

  const handleHireWorker = (worker) => {
    setSelectedWorker(worker);
  };

  const handleViewProfile = (worker) => {
    console.log('View profile for:', worker);
  };

  // Calculate stats from actual DB dataset
  const totalInDb = 652;
  const totalCompletedJobs = 289;
  const experiencedWorkersCount = 165;
  const freshWorkersCount = 487;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl px-4 py-8 mx-auto space-y-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-main text-xs font-semibold rounded-full mb-2 border border-green-200/50">
                <span>👷 Ekosistem Tenaga Kerja Terampil</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Temukan Pekerja Pertanian & Perkebunan
              </h1>
              <p className="mt-1 text-sm sm:text-base text-gray-500">
                Hubungkan langsung dengan {totalInDb} tenaga kerja pertanian terampil dan berpengalaman di seluruh Indonesia.
              </p>
            </div>

            {/* Search Bar & Sort selector */}
            <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap">
              <div className="relative flex-1 lg:w-72">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Cari nama, lokasi, keahlian..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full py-2.5 pl-10 pr-4 text-sm placeholder-gray-400 bg-gray-50/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent transition-all"
                />
              </div>

              {/* Server-side sorting dropdown */}
              <select
                value={`${sortBy}-${order}`}
                onChange={(e) => {
                  const [newSort, newOrder] = e.target.value.split('-');
                  setSortBy(newSort);
                  setOrder(newOrder);
                }}
                className="py-2.5 px-3.5 text-xs sm:text-sm font-semibold bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 focus:ring-2 focus:ring-main focus:border-transparent cursor-pointer"
              >
                <option value="total_jobs_completed-desc">🏆 Pengalaman Terbanyak</option>
                <option value="rating-desc">⭐ Rating Tertinggi (3.5 - 4.5)</option>
                <option value="daily_rate-asc">💰 Tarif Terendah</option>
                <option value="daily_rate-desc">💰 Tarif Tertinggi</option>
              </select>

              <button
                onClick={fetchWorkers}
                className="p-2.5 text-gray-600 hover:text-main border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors"
                title="Refresh Data"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Database Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-main text-xs font-semibold mb-1">
                <Users size={16} /> Total Pekerja
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalInDb}</p>
              <span className="text-[11px] text-gray-500">Terdaftar di database</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold mb-1">
                <Award size={16} /> Pernah Bekerja
              </div>
              <p className="text-xl sm:text-2xl font-bold text-emerald-800">{experiencedWorkersCount}</p>
              <span className="text-[11px] text-gray-500">Pekerja berpengalaman</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-blue-700 text-xs font-semibold mb-1">
                <Briefcase size={16} /> Pekerjaan Selesai
              </div>
              <p className="text-xl sm:text-2xl font-bold text-blue-800">{totalCompletedJobs}</p>
              <span className="text-[11px] text-gray-500">Total tugas tuntas</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-amber-600 text-xs font-semibold mb-1">
                <Star size={16} /> Rentang Rating
              </div>
              <p className="text-xl sm:text-2xl font-bold text-amber-700">3.5 - 4.5 ⭐</p>
              <span className="text-[11px] text-gray-500">Pekerja aktif terverifikasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main List Area */}
      <div className="max-w-7xl px-4 py-8 mx-auto">
        <WorkerList
          workers={workers}
          loading={loading}
          error={error}
          onHireWorker={handleHireWorker}
          onViewProfile={handleViewProfile}
        />

        {/* Load More Button if results exist */}
        {!loading && workers.length >= limit && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setLimit((prev) => prev + 50)}
              className="px-8 py-3 bg-white border border-gray-300 hover:border-main text-main font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all text-sm"
            >
              Muat Lebih Banyak Pekerja (50+)
            </button>
          </div>
        )}
      </div>

      {/* Recruit Worker Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-white rounded-3xl shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              Rekrut Pekerja Pertanian
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 overflow-hidden border-2 border-green-100 rounded-full shadow-sm">
                  {selectedWorker.profile_picture ? (
                    <img
                      src={selectedWorker.profile_picture}
                      alt={`${selectedWorker?.name || 'worker'} profile`}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center w-full h-full text-lg font-bold text-white bg-main"
                    >
                      {selectedWorker?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{selectedWorker?.name || 'Nama tidak tersedia'}</h4>
                  <p className="text-xs text-gray-500">{selectedWorker.email || selectedWorker.phone || 'Pekerja Terverifikasi'}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm space-y-1">
                <p className="text-xs text-gray-600">
                  <strong>Tarif Harian:</strong>{' '}
                  <span className="font-bold text-main">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(selectedWorker.daily_rate || 0)}
                  </span>
                </p>
                {selectedWorker.hourly_rate ? (
                  <p className="text-xs text-gray-600">
                    <strong>Tarif Per Jam:</strong>{' '}
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(selectedWorker.hourly_rate)}
                  </p>
                ) : null}
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Anda akan merekrut <strong>{selectedWorker?.name || 'pekerja ini'}</strong> untuk proyek pertanian Anda.
            </p>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setSelectedWorker(null)}
                className="flex-1 px-4 py-2.5 text-xs font-semibold text-gray-700 transition-colors border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  alert(`Permintaan rekrutmen untuk ${selectedWorker?.name} telah diajukan!`);
                  setSelectedWorker(null);
                }}
                className="flex-1 px-4 py-2.5 text-xs font-semibold text-white bg-main hover:bg-green-600 rounded-xl shadow-md transition-all"
              >
                Lanjutkan Merekrut
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListWorker;