import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdVisibility,
  MdEdit,
  MdDownload,
  MdWork,
  MdFilterList,
  MdSearch,
  MdClose,
  MdCheck,
} from "react-icons/md";
import { getProjects } from "../../../../services/projectService";
import { format } from "crypto-js";

// Skeleton Components
const SkeletonLine = ({ width = "w-full", height = "h-4" }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${width} ${height}`}></div>
);

const SkeletonBox = ({ width = "w-full", height = "h-4" }) => (
  <div
    className={`bg-gray-200 rounded-lg animate-pulse ${width} ${height}`}
  ></div>
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

const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Filter states
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    projectType: [],
    paymentType: [],
    paymentRange: [],
  });
  const [tempFilters, setTempFilters] = useState({
    projectType: [],
    paymentType: [],
    paymentRange: [],
  });

  const navigate = useNavigate();

  // Fetch projects data
  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getProjects();
      if (response.status === "success" && response.data) {
        setProjects(response.data.data || []);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Gagal memuat data proyek.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Get filter options
  const getFilterOptions = () => {
    const projectTypes = [
      ...new Set(
        projects.map((project) => project.project_type).filter(Boolean)
      ),
    ];
    const paymentTypes = [
      ...new Set(
        projects.map((project) => project.payment_type).filter(Boolean)
      ),
    ];

    // Payment range categories
    const paymentRangeCategories = [
      { label: "< Rp 50.000", value: "low", min: 0, max: 50000 },
      {
        label: "Rp 50.000 - Rp 100.000",
        value: "medium",
        min: 50000,
        max: 100000,
      },
      {
        label: "Rp 100.000 - Rp 500.000",
        value: "high",
        min: 100000,
        max: 500000,
      },
      { label: "> Rp 500.000", value: "very_high", min: 500000, max: Infinity },
    ];

    return {
      projectType: projectTypes.map((type) => ({
        label: type || "Tidak Ditentukan",
        value: type || "",
      })),
      paymentType: paymentTypes.map((type) => ({ label: type, value: type })),
      paymentRange: paymentRangeCategories,
    };
  };

  // Filter projects based on search and filter criteria
  const filteredProjects = projects.filter((project) => {
    // Search filter
    const matchesSearch =
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.project_type?.toLowerCase().includes(searchTerm.toLowerCase());

    // Payment type filter
    const matchesPaymentType =
      selectedFilters.paymentType.length === 0 ||
      selectedFilters.paymentType.includes(project.payment_type);

    // Payment range filter
    const matchesPaymentRange =
      selectedFilters.paymentRange.length === 0 ||
      selectedFilters.paymentRange.some((filterValue) => {
        const category = getFilterOptions().paymentRange.find(
          (cat) => cat.value === filterValue
        );
        const projectPayment = parseFloat(project.payment_rate || 0);
        return projectPayment >= category.min && projectPayment < category.max;
      });

    return (
      matchesSearch &&
      matchesPaymentType &&
      matchesPaymentRange
    );
  });

  // Filter handlers
  const handleFilterToggle = (category, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const handleApplyFilters = () => {
    setSelectedFilters(tempFilters);
    setFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      projectType: [],
      paymentType: [],
      paymentRange: [],
    };
    setTempFilters(emptyFilters);
    setSelectedFilters(emptyFilters);
  };

  const handleOpenFilterModal = () => {
    setTempFilters(selectedFilters);
    setFilterModalOpen(true);
  };

  // Get active filter count
  const activeFilterCount = Object.values(selectedFilters).reduce(
    (sum, filters) => sum + filters.length,
    0
  );

  // Action handlers
  const handleView = (projectId) => {
    navigate(`/dashboard/projects/view/${projectId}`);
  };

  const handleEdit = (projectId) => {
    navigate(`/dashboard/projects/edit/${projectId}`);
  };

  const handleAddNew = () => {
    navigate("/dashboard/projects/create");
  };

  const formatPayment = (rate) => {
    const formattedRate = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(rate);

    return `${formattedRate}`;
  };

  const formatPaymentType = (type) => {
    const typeLabel = {
      'per_day': "harian",
      'per_hour': "per jam",
      'per_project': "per proyek",
      'per_month': "bulanan",
    };
    return ` ${typeLabel[type] || type}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
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
          <h1 className="text-3xl font-bold text-main mb-2">Daftar Proyek</h1>
          <p className="text-main_text">Kelola data proyek Anda</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-6 py-3 bg-main hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
        >
          <MdAdd size={20} />
          Tambah Proyek
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
            <MdSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari proyek berdasarkan judul atau tipe..."
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
            {selectedFilters.projectType.map((filter) => (
              <span
                key={filter}
                className="bg-main bg-opacity-10 text-main px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                Tipe: {filter || "Tidak Ditentukan"}
                <button
                  onClick={() => handleFilterToggle("projectType", filter)}
                  className="hover:bg-main hover:bg-opacity-20 rounded-full p-0.5"
                >
                  <MdClose size={14} />
                </button>
              </span>
            ))}
            {selectedFilters.paymentType.map((filter) => (
              <span
                key={filter}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                Pembayaran: {filter}
                <button
                  onClick={() => handleFilterToggle("paymentType", filter)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <MdClose size={14} />
                </button>
              </span>
            ))}
            {selectedFilters.paymentRange.map((filter) => {
              const category = filterOptions.paymentRange.find(
                (cat) => cat.value === filter
              );
              return (
                <span
                  key={filter}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  Range: {category?.label}
                  <button
                    onClick={() => handleFilterToggle("paymentRange", filter)}
                    className="hover:bg-purple-200 rounded-full p-0.5"
                  >
                    <MdClose size={14} />
                  </button>
                </span>
              );
            })}
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
        {filteredProjects.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-4">
              <MdWork size={64} className="text-gray-300 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {projects.length === 0
                ? "Belum Ada Proyek"
                : "Tidak Ada Data yang Sesuai"}
            </h3>
            <p className="text-gray-500 mb-4">
              {projects.length === 0
                ? "Mulai tambahkan proyek untuk mengelola data Anda."
                : "Coba ubah kriteria pencarian atau filter Anda."}
            </p>
            {projects.length === 0 && (
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-main hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                Tambah Proyek Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto md:overflow-x-hidden w-full max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">
                    No
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">
                    Nama Proyek
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">
                    Gaji
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">
                    Tipe
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">
                    Pekerja
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">
                    Durasi
                  </th>
                  <th className="text-center px-6 py-4 font-semibold text-gray-900">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project, index) => (
                  <tr
                    key={project.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-main_text">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {project.title}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-main_text font-medium">
                      {formatPayment(
                        project.payment_rate
                      )}
                    </td>
                    <td className="px-6 py-4 text-main_text">
                      {formatPaymentType(
                        project.payment_type
                      )}
                    </td>
                    <td className="px-6 py-4 text-main_text">
                      0/{project.workers_needed || 0}
                    </td>
                    <td className="px-6 py-4 text-main_text flex flex-col gap-1">
                      <span>{formatDate(project.start_date)} - </span>
                      <span>{formatDate(project.end_date || project.start_date)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(project.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <MdVisibility size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(project.id)}
                          className="p-2 text-main hover:bg-green-100 rounded-lg transition-colors"
                          title="Edit Proyek"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          // onClick={() => handleEdit(project.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Unduh Kontrak"
                        >
                          <MdDownload size={18} />
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
              <h3 className="text-lg font-semibold text-gray-900">
                Filter Proyek
              </h3>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Payment Type Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Tipe Pembayaran
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {filterOptions.paymentType.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={tempFilters.paymentType.includes(option.value)}
                        onChange={() =>
                          handleFilterToggle("paymentType", option.value)
                        }
                        className="w-4 h-4 text-main border-gray-300 rounded focus:ring-main"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Range Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Batas Gaji
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {filterOptions.paymentRange.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={tempFilters.paymentRange.includes(
                          option.value
                        )}
                        onChange={() =>
                          handleFilterToggle("paymentRange", option.value)
                        }
                        className="w-4 h-4 text-main border-gray-300 rounded focus:ring-main"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        {option.label}
                      </span>
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
    </div>
  );
};

export default ProjectListPage;
