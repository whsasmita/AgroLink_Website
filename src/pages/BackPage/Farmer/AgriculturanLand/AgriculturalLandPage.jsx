import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MdAdd, 
  MdVisibility, 
  MdEdit, 
  MdDelete, 
  MdLocationOn, 
  MdFilterList,
  MdSearch,
  MdRefresh,
  MdClose,
  MdCheck
} from "react-icons/md";
import { 
  getMyFarms, 
  deleteAgriculturalLand 
} from "../../../../services/farmerService";

// Skeleton Components
const SkeletonLine = ({ width = "w-full", height = "h-4" }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${width} ${height}`}></div>
);

const SkeletonBox = ({ width = "w-full", height = "h-4" }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${width} ${height}`}></div>
);

const TableRowSkeleton = () => (
  <tr className="border-b border-gray-100">
    <td className="px-6 py-4">
      <SkeletonLine width="w-6" height="h-4" />
    </td>
    <td className="px-6 py-4">
      <SkeletonLine width="w-32" height="h-5" />
    </td>
    <td className="px-6 py-4">
      <SkeletonLine width="w-20" height="h-4" />
    </td>
    <td className="px-6 py-4">
      <SkeletonLine width="w-16" height="h-4" />
    </td>
    <td className="px-6 py-4">
      <SkeletonLine width="w-28" height="h-4" />
    </td>
    <td className="px-6 py-4">
      <SkeletonLine width="w-24" height="h-4" />
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center justify-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </td>
  </tr>
);

const LoadingSkeleton = () => (
  <div className="p-4">
    {/* Header Skeleton */}
    <div className="flex flex-col sm:flex-row bg-white rounded-lg shadow-sm p-4 justify-between items-start sm:items-center mb-4 gap-4">
      <div>
        <SkeletonLine width="w-48" height="h-8" />
        <div className="mt-2">
          <SkeletonLine width="w-64" height="h-4" />
        </div>
      </div>
      <SkeletonBox width="w-32" height="h-12" />
    </div>

    {/* Search and Filter Skeleton */}
    <div className="mb-4 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input Skeleton */}
        <div className="flex-1">
          <SkeletonBox width="w-full" height="h-12" />
        </div>
        
        {/* Filter Button Skeleton */}
        <SkeletonBox width="w-20" height="h-12" />
      </div>
    </div>

    {/* Table Skeleton */}
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-4">
                <SkeletonLine width="w-8" height="h-4" />
              </th>
              <th className="text-left px-6 py-4">
                <SkeletonLine width="w-24" height="h-4" />
              </th>
              <th className="text-left px-6 py-4">
                <SkeletonLine width="w-28" height="h-4" />
              </th>
              <th className="text-left px-6 py-4">
                <SkeletonLine width="w-20" height="h-4" />
              </th>
              <th className="text-left px-6 py-4">
                <SkeletonLine width="w-20" height="h-4" />
              </th>
              <th className="text-left px-6 py-4">
                <SkeletonLine width="w-16" height="h-4" />
              </th>
              <th className="text-center px-6 py-4">
                <SkeletonLine width="w-12" height="h-4" />
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, index) => (
              <TableRowSkeleton key={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const AgriculturalLandPage = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [farmToDelete, setFarmToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // Filter states
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    areaSize: [],
    cropType: [],
    irrigationType: []
  });
  const [tempFilters, setTempFilters] = useState({
    areaSize: [],
    cropType: [],
    irrigationType: []
  });
  
  const navigate = useNavigate();

  // Fetch farms data
  const fetchFarms = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMyFarms();
      if (response.status === "success" && response.data) {
        setFarms(response.data);
      } else {
        setFarms([]);
      }
    } catch (err) {
      console.error("Error fetching farms:", err);
      setError("Gagal memuat data lahan pertanian.");
      setFarms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  // Get filter options
  const getFilterOptions = () => {
    const cropTypes = [...new Set(farms.map(farm => farm.crop_type).filter(Boolean))];
    const irrigationTypes = [...new Set(farms.map(farm => farm.irrigation_type).filter(Boolean))];
    
    // Area size categories
    const areaSizeCategories = [
      { label: "< 1 ha", value: "small", min: 0, max: 1 },
      { label: "1 - 5 ha", value: "medium", min: 1, max: 5 },
      { label: "5 - 10 ha", value: "large", min: 5, max: 10 },
      { label: "> 10 ha", value: "xlarge", min: 10, max: Infinity }
    ];

    return {
      areaSize: areaSizeCategories,
      cropType: cropTypes.map(type => ({ label: type, value: type })),
      irrigationType: irrigationTypes.map(type => ({ label: type, value: type }))
    };
  };

  // Filter farms based on search and filter criteria
  const filteredFarms = farms.filter(farm => {
    // Search filter
    const matchesSearch = farm.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farm.crop_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farm.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Area size filter
    const matchesAreaSize = selectedFilters.areaSize.length === 0 || 
      selectedFilters.areaSize.some(filterValue => {
        const category = getFilterOptions().areaSize.find(cat => cat.value === filterValue);
        const farmArea = parseFloat(farm.area_size || 0);
        return farmArea > category.min && farmArea <= category.max;
      });

    // Crop type filter
    const matchesCropType = selectedFilters.cropType.length === 0 ||
      selectedFilters.cropType.includes(farm.crop_type);

    // Irrigation type filter
    const matchesIrrigationType = selectedFilters.irrigationType.length === 0 ||
      selectedFilters.irrigationType.includes(farm.irrigation_type);
    
    return matchesSearch && matchesAreaSize && matchesCropType && matchesIrrigationType;
  });

  // Filter handlers
  const handleFilterToggle = (category, value) => {
    setTempFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleApplyFilters = () => {
    setSelectedFilters(tempFilters);
    setFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      areaSize: [],
      cropType: [],
      irrigationType: []
    };
    setTempFilters(emptyFilters);
    setSelectedFilters(emptyFilters);
  };

  const handleOpenFilterModal = () => {
    setTempFilters(selectedFilters);
    setFilterModalOpen(true);
  };

  // Get active filter count
  const activeFilterCount = Object.values(selectedFilters).reduce((sum, filters) => sum + filters.length, 0);

  // Action handlers
  const handleView = (farmId) => {
    navigate(`/dashboard/agricultural-land/view/${farmId}`);
  };

  const handleEdit = (farmId) => {
    navigate(`/dashboard/agricultural-land/edit/${farmId}`);
  };

  const handleDeleteClick = (farm) => {
    setFarmToDelete(farm);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!farmToDelete) return;

    setDeleting(true);
    try {
      const response = await deleteAgriculturalLand(farmToDelete.id);
      if (response.status === "success") {
        setFarms(prevFarms => prevFarms.filter(farm => farm.id !== farmToDelete.id));
        setDeleteModalOpen(false);
        setFarmToDelete(null);
      } else {
        setError("Gagal menghapus lahan pertanian.");
      }
    } catch (err) {
      console.error("Error deleting farm:", err);
      setError("Gagal menghapus lahan pertanian.");
    } finally {
      setDeleting(false);
    }
  };

  const handleAddNew = () => {
    navigate("/dashboard/agricultural-land/create");
  };

  const formatArea = (area) => {
    return `${parseFloat(area).toLocaleString('id-ID')} ha`;
  };

  const formatCoordinate = (lat, lng) => {
    return `${parseFloat(lat).toFixed(6)}, ${parseFloat(lng).toFixed(6)}`;
  };

  // Show skeleton while loading
  if (loading) {
    return <LoadingSkeleton />;
  }

  const filterOptions = getFilterOptions();

  return (
    <div className="p-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row bg-white rounded-lg shadow-sm p-4 justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-main mb-2">Lahan Pertanian</h1>
          <p className="text-main_text">Kelola data lahan pertanian Anda</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-6 py-3 bg-main hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
        >
          <MdAdd size={20} />
          Tambah Lahan
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-danger p-4 rounded-r-lg">
          <span className="text-danger font-medium">{error}</span>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-4 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari lahan, tanaman, atau deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
            />
          </div>
          
          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={handleOpenFilterModal}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative"
            >
              <MdFilterList size={20} className="text-gray-600" />
              <span className="text-gray-700">Filter</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-main text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedFilters.areaSize.map(filter => {
              const category = filterOptions.areaSize.find(cat => cat.value === filter);
              return (
                <span key={filter} className="bg-main bg-opacity-10 text-main px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  Luas: {category?.label}
                  <button
                    onClick={() => handleFilterToggle('areaSize', filter)}
                    className="hover:bg-main hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <MdClose size={14} />
                  </button>
                </span>
              );
            })}
            {selectedFilters.cropType.map(filter => (
              <span key={filter} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                Tanaman: {filter}
                <button
                  onClick={() => handleFilterToggle('cropType', filter)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <MdClose size={14} />
                </button>
              </span>
            ))}
            {selectedFilters.irrigationType.map(filter => (
              <span key={filter} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                Irigasi: {filter}
                <button
                  onClick={() => handleFilterToggle('irrigationType', filter)}
                  className="hover:bg-purple-200 rounded-full p-0.5"
                >
                  <MdClose size={14} />
                </button>
              </span>
            ))}
            <button
              onClick={handleResetFilters}
              className="text-gray-500 hover:text-gray-700 px-2 py-1 text-sm underline"
            >
              Hapus Semua
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {filteredFarms.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-4">
              <MdLocationOn size={64} className="text-gray-300 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {farms.length === 0 ? "Belum Ada Lahan Pertanian" : "Tidak Ada Data yang Sesuai"}
            </h3>
            <p className="text-gray-500 mb-4">
              {farms.length === 0 
                ? "Mulai tambahkan lahan pertanian untuk mengelola data Anda."
                : "Coba ubah kriteria pencarian atau filter Anda."
              }
            </p>
            {farms.length === 0 && (
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-main hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                Tambah Lahan Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">No</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Nama Lahan</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Jenis Tanaman</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Luas Area</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Irigasi</th>
                  <th className="text-center px-6 py-4 font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredFarms.map((farm, index) => (
                  <tr 
                    key={farm.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-main_text">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{farm.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-main_text text-sm font-medium">
                        {farm.crop_type}
                    </td>
                    <td className="px-6 py-4 text-main_text font-medium">
                      {formatArea(farm.area_size)}
                    </td>
                    <td className="px-6 py-4 text-main_text">
                      {farm.irrigation_type}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(farm.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <MdVisibility size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(farm.id)}
                          className="p-2 text-main hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Lahan"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(farm)}
                          className="p-2 text-danger hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Lahan"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {filterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Filter Lahan Pertanian</h3>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Area Size Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Luas Area</h4>
                <div className="grid grid-cols-2 gap-2">
                  {filterOptions.areaSize.map(option => (
                    <label key={option.value} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempFilters.areaSize.includes(option.value)}
                        onChange={() => handleFilterToggle('areaSize', option.value)}
                        className="w-4 h-4 text-main border-gray-300 rounded focus:ring-main"
                      />
                      <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Crop Type Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Jenis Tanaman</h4>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {filterOptions.cropType.map(option => (
                    <label key={option.value} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempFilters.cropType.includes(option.value)}
                        onChange={() => handleFilterToggle('cropType', option.value)}
                        className="w-4 h-4 text-main border-gray-300 rounded focus:ring-main"
                      />
                      <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Irrigation Type Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Jenis Irigasi</h4>
                <div className="grid grid-cols-2 gap-2">
                  {filterOptions.irrigationType.map(option => (
                    <label key={option.value} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempFilters.irrigationType.includes(option.value)}
                        onChange={() => handleFilterToggle('irrigationType', option.value)}
                        className="w-4 h-4 text-main border-gray-300 rounded focus:ring-main"
                      />
                      <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 justify-end p-6 border-t border-gray-200">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-main hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <MdCheck size={16} />
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Konfirmasi Hapus Lahan
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus lahan <strong>"{farmToDelete?.name}"</strong>? 
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setFarmToDelete(null);
                }}
                disabled={deleting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 bg-danger hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menghapus...
                  </>
                ) : (
                  <>
                    <MdDelete size={16} />
                    Hapus
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgriculturalLandPage;