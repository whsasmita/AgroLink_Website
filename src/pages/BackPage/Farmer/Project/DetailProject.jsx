import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  MdArrowBack, 
  MdEdit, 
  MdDelete, 
  MdPerson, 
  MdLocationOn, 
  MdCalendarToday,
  MdAttachMoney,
  MdWork,
  MdDescription,
  MdPeople,
  MdSchedule
} from "react-icons/md";
import { 
  getProjectById,
//   deleteProject
} from "../../../../services/projectService";

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="p-4">
    <div className="flex items-center mb-6">
      <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse mr-4"></div>
      <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
    </div>
    
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="w-64 h-10 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-6"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="w-full h-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

const ProjectDetailPage = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch project data
  const fetchProject = async () => {
    console.log("Fetching project with ID:", id); // Debug log
    setLoading(true);
    setError("");
    
    try {
      const response = await getProjectById(id);
      console.log("API Response:", response); // Debug log
      
      // Fix: Check for the correct response structure
      if (response && response.status === "success" && response.data) {
        console.log("Project data found:", response.data); // Debug log
        setProject(response.data);
      } else if (response && response.data) {
        // Alternative: Sometimes API might not have status field
        console.log("Project data found (no status field):", response.data); // Debug log
        setProject(response.data);
      } else {
        console.log("Project not found in response"); // Debug log
        setError("Proyek tidak ditemukan.");
      }
    } catch (err) {
      console.error("Error fetching project:", err);
      setError(err.message || "Gagal memuat data proyek.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProject();
    } else {
      setError("ID proyek tidak valid.");
      setLoading(false);
    }
  }, [id]);

  const handleBack = () => {
    navigate("/dashboard/projects");
  };

  const handleEdit = () => {
    navigate(`/dashboard/projects/edit/${project.id}`);
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      // Uncomment when deleteProject service is available
      // const response = await deleteProject(project.id);
      // if (response.status === "success") {
      //   navigate("/dashboard/projects");
      // } else {
      //   setError("Gagal menghapus proyek.");
      // }
      
      // Temporary implementation for demo
      navigate("/dashboard/projects");
    } catch (err) {
      console.error("Error deleting project:", err);
      setError("Gagal menghapus proyek.");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const formatPayment = (rate, type) => {
    if (!rate) return 'Tidak disebutkan';
    
    const formattedRate = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(rate);
    
    const typeLabel = {
      'per_day': '/hari',
      'per_hour': '/jam',
      'per_project': '/proyek',
      'per_month': '/bulan'
    };
    
    return `${formattedRate} ${typeLabel[type] || type}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Tidak disebutkan';
    
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Format tanggal tidak valid';
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'open': { label: 'Terbuka', className: 'bg-main text-white' },
      'in_progress': { label: 'Sedang Berjalan', className: 'bg-progress text-black' },
      'completed': { label: 'Selesai', className: 'bg-done text-black' },
      'cancelled': { label: 'Dibatalkan', className: 'bg-danger text-white' },
      'closed': { label: 'Ditutup', className: 'bg-pending text-black' }
    };
    
    const config = statusConfig[status] || { label: status, className: 'bg-gray-500 text-white' };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Tidak disebutkan';
    
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} hari`;
    } catch (error) {
      return 'Tidak dapat dihitung';
    }
  };

  // Debug information in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Component State:', { project, loading, error, id });
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MdArrowBack size={24} />
          </button>
          <h2 className="text-2xl font-bold text-main">Detail Proyek</h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-l-4 border-danger p-4 rounded-r-lg">
            <div className="flex">
              <MdWork className="text-danger mr-3 mt-1" size={20} />
              <div>
                <h3 className="text-lg font-medium text-danger mb-1">Terjadi Kesalahan</h3>
                <p className="text-danger">{error}</p>
                <button
                  onClick={() => fetchProject()}
                  className="mt-3 px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-4">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MdArrowBack size={24} />
          </button>
          <h2 className="text-2xl font-bold text-main">Detail Proyek</h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <MdWork size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Proyek Tidak Ditemukan</h3>
            <p className="text-gray-500 mb-4">Proyek yang Anda cari tidak dapat ditemukan.</p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-main hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              Kembali ke Daftar Proyek
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MdArrowBack size={24} />
          </button>
          <h2 className="text-2xl font-bold text-main">Detail Proyek</h2>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 text-main border border-main rounded-lg hover:bg-main hover:text-white transition-colors"
          >
            <MdEdit size={16} />
            Edit
          </button>
          <button
            onClick={handleDeleteClick}
            className="flex items-center gap-2 px-4 py-2 text-danger border border-danger rounded-lg hover:bg-danger hover:text-white transition-colors"
          >
            <MdDelete size={16} />
            Hapus
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Project Title and Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title || 'Nama Proyek'}</h1>
              {getStatusBadge(project.status)}
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Farmer */}
              <div className="flex items-start gap-3">
                <MdPerson className="text-gray-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pemilik Proyek</p>
                  <p className="text-gray-900 font-medium">{project.farmer?.name || 'Tidak tersedia'}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <MdLocationOn className="text-gray-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Lokasi</p>
                  <p className="text-gray-900">{project.location || 'Tidak disebutkan'}</p>
                </div>
              </div>

              {/* Workers Needed */}
              <div className="flex items-start gap-3">
                <MdPeople className="text-gray-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pekerja Dibutuhkan</p>
                  <p className="text-gray-900 font-medium">{project.workers_needed || 0} orang</p>
                </div>
              </div>

              {/* Payment */}
              <div className="flex items-start gap-3">
                <MdAttachMoney className="text-gray-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pembayaran</p>
                  <p className="text-gray-900 font-medium">{formatPayment(project.payment_rate, project.payment_type)}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Start Date */}
              <div className="flex items-start gap-3">
                <MdCalendarToday className="text-gray-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Tanggal Mulai</p>
                  <p className="text-gray-900">{formatDate(project.start_date)}</p>
                </div>
              </div>

              {/* End Date */}
              <div className="flex items-start gap-3">
                <MdCalendarToday className="text-gray-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Tanggal Selesai</p>
                  <p className="text-gray-900">{formatDate(project.end_date)}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-start gap-3">
                <MdSchedule className="text-gray-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Durasi Proyek</p>
                  <p className="text-gray-900 font-medium">{calculateDuration(project.start_date, project.end_date)}</p>
                </div>
              </div>

              {/* Project ID */}
              <div className="flex items-start gap-3">
                <MdWork className="text-gray-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-600">ID Proyek</p>
                  <p className="text-gray-900 font-mono text-sm">{project.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-start gap-3">
              <MdDescription className="text-gray-600 mt-1 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">Deskripsi Proyek</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {project.description || 'Tidak ada deskripsi tersedia.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Konfirmasi Hapus Proyek
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus proyek <strong>"{project.title}"</strong>? 
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModalOpen(false)}
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

export default ProjectDetailPage;