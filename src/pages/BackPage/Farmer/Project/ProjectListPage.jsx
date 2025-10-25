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
  MdMail,
  MdInbox,
  MdReceipt,
  MdPayments,
} from "react-icons/md";
import { getMyProjects } from "../../../../services/projectService";
import { getApplications } from "../../../../services/applicationService";
import { initiatePayment } from "../../../../services/paymentService"; // Import the new service

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
    <td className="px-4 py-4 sm:px-6">
      <SkeletonLine width="w-6" height="h-4" />
    </td>
    <td className="px-4 py-4 sm:px-6">
      <SkeletonLine width="w-32" height="h-5" />
    </td>
    <td className="hidden px-4 py-4 sm:px-6 sm:table-cell">
      <SkeletonLine width="w-20" height="h-4" />
    </td>
    <td className="px-4 py-4 sm:px-6">
      <SkeletonLine width="w-16" height="h-4" />
    </td>
    <td className="px-4 py-4 sm:px-6">
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </td>
  </tr>
);

const LoadingSkeleton = () => (
  <div className="p-2 sm:p-4">
    {/* Header Skeleton */}
    <div className="flex flex-col items-start justify-between gap-4 p-4 mb-4 bg-white rounded-lg shadow-sm sm:flex-row sm:items-center">
      <div>
        <SkeletonLine width="w-48" height="h-8" />
        <div className="mt-2">
          <SkeletonLine width="w-64" height="h-4" />
        </div>
      </div>
      <SkeletonBox width="w-32" height="h-12" />
    </div>

    {/* Search and Filter Skeleton */}
    <div className="p-4 mb-4 bg-white border border-gray-100 rounded-lg shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <SkeletonBox width="w-full" height="h-12" />
        </div>
        <SkeletonBox width="w-20" height="h-12" />
      </div>
    </div>

    {/* Table Skeleton */}
    <div className="overflow-hidden bg-white rounded-lg shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-4 text-left sm:px-6">
                <SkeletonLine width="w-8" height="h-4" />
              </th>
              <th className="px-4 py-4 text-left sm:px-6">
                <SkeletonLine width="w-24" height="h-4" />
              </th>
              <th className="hidden px-4 py-4 text-left sm:px-6 sm:table-cell">
                <SkeletonLine width="w-28" height="h-4" />
              </th>
              <th className="px-4 py-4 text-left sm:px-6">
                <SkeletonLine width="w-20" height="h-4" />
              </th>
              <th className="px-4 py-4 text-center sm:px-6">
                <SkeletonLine width="w-12" height="h-4" />
              </th>
              <th className="px-4 py-4 text-center sm:px-6">
                <SkeletonLine width="w-24" height="h-4" />
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
  const [applicationCounts, setApplicationCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Filter states
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    status: [],
    workerCount: [],
  });
  const [tempFilters, setTempFilters] = useState({
    status: [],
    workerCount: [],
  });

  const navigate = useNavigate();

  // Fetch application count for a project
  const fetchApplicationCount = async (projectId) => {
    try {
      const response = await getApplications(projectId);
      return response.data ? response.data.length : 0;
    } catch (err) {
      console.error(`Error fetching applications for project ${projectId}:`, err);
      return 0;
    }
  };

  // Fetch projects data and application counts
  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMyProjects();
      if (response.data && Array.isArray(response.data)) {
        const projectsData = response.data || [];
        setProjects(projectsData);
        
        // Fetch application counts for all projects
        const counts = {};
        await Promise.all(
          projectsData.map(async (project) => {
            const count = await fetchApplicationCount(project.project_id);
            counts[project.project_id] = count;
          })
        );
        setApplicationCounts(counts);
      } else {
        setProjects([]);
        setApplicationCounts({});
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Gagal memuat data proyek.");
      setProjects([]);
      setApplicationCounts({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handler for payment
  const handlePayment = async (projectId, invoiceId) => {
    setError("");
    try {
      const result = await initiatePayment(invoiceId, projectId);
      
      if (result && result.data && result.data.redirect_url) {
        window.location.href = result.data.redirect_url;
      } else {
        setError("URL pembayaran tidak ditemukan. Silakan hubungi admin.");
        console.error("Initiate payment response did not contain a redirect URL:", result);
      }
    } catch (err) {
      console.error("Error initiating payment:", err);
      setError(err.message || "Gagal memulai pembayaran. Silakan coba lagi.");
    }
  };

  // Get filter options
  const getFilterOptions = () => {
    const statuses = [
      ...new Set(
        projects.map((project) => project.project_status).filter(Boolean)
      ),
    ];

    // Worker count categories
    const workerCountCategories = [
      { label: "Di bawah 3 pekerja", value: "low", min: 0, max: 2 },
      { label: "3 - 5 pekerja", value: "medium", min: 3, max: 5 },
      { label: "Di atas 5 pekerja", value: "high", min: 6, max: Infinity },
    ];

    return {
      status: statuses.map((status) => ({
        label: status === 'open' ? 'Terbuka' :
               status === 'in_progress' ? 'Sedang Berjalan' :
               status === 'completed' ? 'Selesai' :
               status === 'cancelled' ? 'Dibatalkan' :
               status === 'closed' ? 'Ditutup' :
               status === 'waiting_payment' ? 'Menunggu Pembayaran' :
               status || "Tidak Ditentukan",
        value: status || "",
      })),
      workerCount: workerCountCategories,
    };
  };

  // Filter projects based on search and filter criteria
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.project_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.project_type?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedFilters.status.length === 0 ||
      selectedFilters.status.includes(project.project_status);

    const matchesWorkerCount =
      selectedFilters.workerCount.length === 0 ||
      selectedFilters.workerCount.some((filterValue) => {
        const category = getFilterOptions().workerCount.find(
          (cat) => cat.value === filterValue
        );
        const projectWorkerCount = parseInt(project.worker_needed || 0);
        return projectWorkerCount >= category.min && projectWorkerCount <= category.max;
      });

    return (
      matchesSearch &&
      matchesStatus &&
      matchesWorkerCount
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
      status: [],
      workerCount: [],
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

  const handleViewApplications = (projectId) => {
    navigate(`/dashboard/projects/view/${projectId}/applications`);
  };

  const handleEdit = (projectId) => {
    navigate(`/dashboard/projects/edit/${projectId}`);
  };

  const handleAddNew = () => {
    navigate("/dashboard/projects/create");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'open': { 
        label: 'Terbuka', 
        bgColor: 'bg-green-500',
        borderColor: 'border-green-200',
        hoverBg: 'hover:bg-green-50'
      },
      'in_progress': { 
        label: 'Sedang Berjalan', 
        bgColor: 'bg-yellow-500',
        borderColor: 'border-yellow-200',
        hoverBg: 'hover:bg-yellow-50'
      },
      'completed': { 
        label: 'Selesai', 
        bgColor: 'bg-blue-500',
        borderColor: 'border-blue-200',
        hoverBg: 'hover:bg-blue-50'
      },
      'cancelled': { 
        label: 'Dibatalkan', 
        bgColor: 'bg-red-500',
        borderColor: 'border-red-200',
        hoverBg: 'hover:bg-red-50'
      },
      'closed': { 
        label: 'Ditutup', 
        bgColor: 'bg-gray-500',
        borderColor: 'border-gray-200',
        hoverBg: 'hover:bg-gray-50'
      },
      'waiting_payment': { 
        label: 'Menunggu Pembayaran', 
        bgColor: 'bg-orange-500',
        borderColor: 'border-orange-200',
        hoverBg: 'hover:bg-orange-50'
      }
    };
    
    const config = statusConfig[status] || { 
      label: status || 'Tidak Diketahui', 
      bgColor: 'bg-gray-400',
      borderColor: 'border-gray-200',
      hoverBg: 'hover:bg-gray-50'
    };
    
    return (
      <div className="relative inline-block group">
        {/* Status Circle */}
        <div 
          className={`w-4 h-4 rounded-full ${config.bgColor} border-2 ${config.borderColor} cursor-help transition-all duration-200 ${config.hoverBg}`}
          title={config.label}
        ></div>
        
        {/* Tooltip */}
        <div className="absolute z-50 px-4 py-2 mb-2 text-sm text-white transition-opacity duration-200 transform -translate-x-1/2 bg-gray-900 rounded-lg opacity-0 pointer-events-none bottom-full left-1/2 group-hover:opacity-100 whitespace-nowrap">
          {config.label}
          {/* Tooltip Arrow */}
          <div className="absolute w-0 h-0 transform -translate-x-1/2 border-t-4 border-l-4 border-r-4 top-full left-1/2 border-l-transparent border-r-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  };

  // Show skeleton while loading
  if (loading) {
    return <LoadingSkeleton />;
  }

  const filterOptions = getFilterOptions();

  return (
    <div className="w-full max-w-[100vw] min-h-screen px-2 sm:px-4 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 p-4 mb-4 bg-white rounded-lg shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl text-main">Daftar Proyek</h1>
          <p className="text-sm text-main_text sm:text-base">Kelola data proyek Anda</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg shadow-lg sm:px-6 sm:py-3 bg-main hover:bg-green-600 hover:shadow-xl sm:text-base sm:w-auto"
        >
          <MdAdd size={20} />
          <span className="sm:inline">Tambah Proyek</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-6 border-l-4 rounded-r-lg bg-red-50 border-danger">
          <span className="text-sm font-medium text-danger sm:text-base">{error}</span>
        </div>
      )}

      {/* Search and Filter */}
      <div className="p-4 mb-4 bg-white border border-gray-100 rounded-lg shadow-sm">
        <div className="flex flex-row items-center gap-2 sm:gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <MdSearch
              className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari proyek..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg sm:py-3 focus:ring-2 focus:ring-main focus:border-transparent sm:text-base"
            />
          </div>
          
          <div className="relative flex-shrink-0">
            <button
              onClick={handleOpenFilterModal}
              className="relative flex items-center justify-center w-full gap-2 px-4 py-2 text-sm transition-colors border border-gray-300 rounded-lg sm:px-4 sm:py-3 hover:bg-gray-50 sm:text-base sm:w-auto"
            >
              <MdFilterList size={20} className="text-gray-600" />
              <span className="hidden text-gray-700 sm:block">Filter</span>
              {activeFilterCount > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white rounded-full -top-2 -right-2 bg-main">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedFilters.status.map((filter) => {
              const statusLabel = filter === 'open' ? 'Terbuka' :
              filter === 'in_progress' ? 'Sedang Berjalan' :
              filter === 'completed' ? 'Selesai' :
              filter === 'cancelled' ? 'Dibatalkan' :
              filter === 'closed' ? 'Ditutup' :
              filter === 'waiting_payment' ? 'Menunggu Pembayaran' :
              filter || "Tidak Ditentukan";
              return (
                <span
                  key={filter}
                  className="flex items-center gap-1 px-4 py-1 text-xs rounded-full bg-main bg-opacity-10 text-main sm:text-sm"
                >
                  Status: {statusLabel}
                  <button
                    onClick={() => handleFilterToggle("status", filter)}
                    className="hover:bg-main hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <MdClose size={14} />
                  </button>
                </span>
              );
            })}
            {selectedFilters.workerCount.map((filter) => {
              const category = filterOptions.workerCount.find(
                (cat) => cat.value === filter
              );
              return (
                <span
                  key={filter}
                  className="flex items-center gap-1 px-4 py-1 text-xs text-purple-800 bg-purple-100 rounded-full sm:text-sm"
                >
                  Pekerja: {category?.label}
                  <button
                    onClick={() => handleFilterToggle("workerCount", filter)}
                    className="hover:bg-purple-200 rounded-full p-0.5"
                  >
                    <MdClose size={14} />
                  </button>
                </span>
              );
            })}
            <button
              onClick={handleResetFilters}
              className="px-2 py-1 text-xs text-gray-500 underline hover:text-gray-700 sm:text-sm"
            >
              Hapus Semua
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white rounded-lg shadow-lg">
        {filteredProjects.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-4">
              <MdWork size={64} className="mx-auto text-gray-300" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {projects.length === 0
                ? "Belum Ada Proyek"
                : "Tidak Ada Data yang Sesuai"}
            </h3>
            <p className="mb-4 text-sm text-gray-500 sm:text-base">
              {projects.length === 0
                ? "Mulai tambahkan proyek untuk mengelola data Anda."
                : "Coba ubah kriteria pencarian atau filter Anda."}
            </p>
            {projects.length === 0 && (
              <button
                onClick={handleAddNew}
                className="px-6 py-3 font-medium text-white transition-colors rounded-lg bg-main hover:bg-green-600"
              >
                Tambah Proyek Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto scroll-smooth">
            <table className="w-full min-w-[640px]">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-sm font-semibold text-left text-gray-900 sm:px-6 sm:py-4 sm:text-base">
                    No
                  </th>
                  <th className="text-left px-4 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base min-w-[200px]">
                    Nama Proyek
                  </th>
                  <th className="hidden px-4 py-3 text-sm font-semibold text-left text-gray-900 sm:px-6 sm:py-4 sm:text-base sm:table-cell">
                    Pekerja
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-left text-gray-900 sm:px-6 sm:py-4 sm:text-base">
                    Status
                  </th>
                  <th className="text-center px-4 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base min-w-[120px]">
                    Aksi
                  </th>
                  <th className="text-center px-4 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base min-w-[120px]">
                    Pembayaran
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project, index) => (
                  <tr
                    key={project.project_id}
                    className="transition-colors border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm sm:px-6 sm:py-4 text-main_text sm:text-base">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 break-words sm:text-base">
                          {project.project_title}
                        </p>
                        <div className="mt-1 text-xs text-gray-500 sm:hidden">
                          Pekerja: {project.current_workers || 0}/{project.worker_needed || 0}
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-sm sm:px-6 sm:py-4 text-main_text sm:text-base sm:table-cell">
                      {project.current_workers || 0}/{project.worker_needed || 0}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="flex justify-start">
                        {getStatusBadge(project.project_status)}
                      </div>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleView(project.project_id)}
                          className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-100"
                          title="Lihat Detail"
                        >
                          <MdVisibility size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        
                        <div className="relative">
                          <button
                            onClick={() => handleViewApplications(project.project_id)}
                            className="relative p-2 transition-colors rounded-lg text-main hover:bg-green-100"
                            title="Lihat Lamaran"
                          >
                            <MdInbox size={16} className="sm:w-[18px] sm:h-[18px]" />
                            {applicationCounts[project.project_id] > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-bold">
                                {applicationCounts[project.project_id] > 99 ? '99+' : applicationCounts[project.project_id]}
                              </span>
                            )}
                          </button>
                        </div>

                        <button
                          className="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                          title="Unduh Kontrak"
                        >
                          <MdDownload size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center sm:px-6 sm:py-4">
                      {project.project_status === 'waiting_payment' ? (
                        <button
                          onClick={() => handlePayment(project.project_id, project.invoice_id)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600 sm:text-sm whitespace-nowrap"
                          title="Bayar Sekarang"
                        >
                          <MdReceipt size={16} />
                          <span>Bayar Sekarang</span>
                        </button>
                      ) : project.project_status === 'completed' ? (
                        <div className="inline-flex items-center gap-1.5 text-green-600 bg-green-100 px-4 py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap">
                          <MdCheck size={16} />
                          <span>Sudah Dibayar</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-gray-500 bg-gray-100 px-4 py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap">
                          <MdPayments size={16} />
                          <span>Belum Perlu</span>
                        </div>
                      )}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sm:p-6">
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
            <div className="p-4 space-y-6 sm:p-6 max-h-[70vh] overflow-y-auto">
              {/* Status Filter */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-900 sm:text-base">
                  Status Proyek
                </h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {filterOptions.status.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={tempFilters.status.includes(option.value)}
                        onChange={() =>
                          handleFilterToggle("status", option.value)
                        }
                        className="w-4 h-4 border-gray-300 rounded text-main focus:ring-main"
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
            <div className="flex flex-col justify-end gap-3 p-4 border-t border-gray-200 sm:flex-row sm:p-6">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-sm text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 sm:text-base"
              >
                Reset
              </button>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 sm:text-base"
              >
                Batal
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white transition-colors rounded-lg bg-main hover:bg-green-600 sm:text-base"
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