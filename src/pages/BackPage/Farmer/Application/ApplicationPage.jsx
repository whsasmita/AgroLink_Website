import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  MdArrowBack, 
  MdCheck, 
  MdClose, 
  MdPerson, 
  MdMessage,
  MdCalendarToday,
  MdWork,
  MdPeople,
  MdRefresh
} from "react-icons/md";
import { 
  getApplications, 
  acceptApplication 
} from "../../../../services/applicationService";
import { getProjectById } from "../../../../services/projectService";

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="p-4">
    <div className="flex items-center mb-6">
      <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse mr-4"></div>
      <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
    </div>
    
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="w-64 h-10 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-6"></div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex gap-2">
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ApplicationPage = () => {
  const [applications, setApplications] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [actionType, setActionType] = useState(""); // "accept" or "reject"
  const [processing, setProcessing] = useState(false);
  
  const navigate = useNavigate();
  const { projectId } = useParams();

  // Fetch applications and project data
  const fetchData = async () => {
    if (!projectId || projectId.trim() === '') {
      setError("ID proyek tidak valid atau kosong.");
      setLoading(false);
      return;
    }

    console.log("Fetching applications for project ID:", projectId);
    
    setLoading(true);
    setError("");
    
    try {
      // Fetch both applications and project data
      const [applicationsResponse, projectResponse] = await Promise.all([
        getApplications(projectId.trim()),
        getProjectById(projectId.trim())
      ]);
      
      console.log("Applications Response:", applicationsResponse);
      console.log("Project Response:", projectResponse);
      
      // Handle applications
      if (applicationsResponse && applicationsResponse.status === "success" && applicationsResponse.data) {
        setApplications(applicationsResponse.data);
      } else {
        setApplications([]);
      }
      
      // Handle project data
      if (projectResponse && projectResponse.status === "success" && projectResponse.data) {
        setProject(projectResponse.data);
      } else if (projectResponse && projectResponse.data) {
        setProject(projectResponse.data);
      }
      
    } catch (err) {
      console.error("Error fetching data:", err);
      
      if (err.message.includes('404')) {
        setError("Data tidak ditemukan. Pastikan ID proyek benar.");
      } else if (err.message.includes('401') || err.message.includes('403')) {
        setError("Anda tidak memiliki akses untuk melihat data ini.");
      } else if (err.message.includes('500')) {
        setError("Server mengalami masalah. Silakan coba lagi nanti.");
      } else {
        setError(err.message || "Gagal memuat data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered with projectId:", projectId);
    
    if (projectId && projectId.trim() !== '') {
      fetchData();
    } else {
      console.log("Invalid projectId in useEffect:", projectId);
      setError("ID proyek tidak valid atau tidak ditemukan di URL.");
      setLoading(false);
    }
  }, [projectId]);

  const handleBack = () => {
    navigate("/dashboard/projects");
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleActionClick = (application, type) => {
    setSelectedApplication(application);
    setActionType(type);
    setActionModalOpen(true);
  };

  const handleActionConfirm = async () => {
    if (!selectedApplication) return;
    
    setProcessing(true);
    try {
      if (actionType === "accept") {
        const response = await acceptApplication(selectedApplication.id);
        if (response.status === "success") {
          // Update the application status locally
          setApplications(prev => 
            prev.map(app => 
              app.id === selectedApplication.id 
                ? { ...app, status: 'accepted' }
                : app
            )
          );
        } else {
          setError("Gagal menerima lamaran.");
        }
      } else if (actionType === "reject") {
        // Implement reject functionality when available
        // const response = await rejectApplication(selectedApplication.id);
        // For now, just update locally
        setApplications(prev => 
          prev.map(app => 
            app.id === selectedApplication.id 
              ? { ...app, status: 'rejected' }
              : app
          )
        );
      }
    } catch (err) {
      console.error(`Error ${actionType}ing application:`, err);
      setError(`Gagal ${actionType === "accept" ? "menerima" : "menolak"} lamaran.`);
    } finally {
      setProcessing(false);
      setActionModalOpen(false);
      setSelectedApplication(null);
      setActionType("");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Tidak disebutkan';
    
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Format tanggal tidak valid';
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-800' },
      'accepted': { label: 'Diterima', className: 'bg-green-100 text-green-800' },
      'rejected': { label: 'Ditolak', className: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

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
          <h2 className="text-2xl font-bold text-main">Lamaran Proyek</h2>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex">
              <MdWork className="text-red-500 mr-3 mt-1" size={20} />
              <div>
                <h3 className="text-lg font-medium text-red-800 mb-1">Terjadi Kesalahan</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => fetchData()}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
          <div>
            <h2 className="text-2xl font-bold text-main">Lamaran Proyek</h2>
            {project && (
              <p className="text-gray-600 mt-1">{project.title}</p>
            )}
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 text-main border border-main rounded-lg hover:bg-main hover:text-white transition-colors"
        >
          <MdRefresh size={16} />
          Refresh
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Project Info Card */}
        {project && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <MdWork className="text-main" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                <p className="text-gray-600 text-sm">{project.location}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MdPeople className="text-gray-400" size={16} />
                <span className="text-gray-600">Pekerja Dibutuhkan: </span>
                <span className="font-medium">{project.workers_needed || 0} orang</span>
              </div>
              <div className="flex items-center gap-2">
                <MdCalendarToday className="text-gray-400" size={16} />
                <span className="text-gray-600">Mulai: </span>
                <span className="font-medium">{formatDate(project.start_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MdMessage className="text-gray-400" size={16} />
                <span className="text-gray-600">Total Lamaran: </span>
                <span className="font-medium">{applications.length}</span>
              </div>
            </div>
          </div>
        )}

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Lamaran</h3>
            <p className="text-sm text-gray-600 mt-1">
              Kelola lamaran yang masuk untuk proyek ini
            </p>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12">
              <MdPeople size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Lamaran</h3>
              <p className="text-gray-500">Belum ada pekerja yang melamar untuk proyek ini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pelamar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pesan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Melamar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-main flex items-center justify-center">
                              <MdPerson className="text-white" size={20} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {application.worker_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {application.worker_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          <div className="truncate" title={application.message}>
                            {application.message || 'Tidak ada pesan'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(application.application_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(application.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {application.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleActionClick(application, 'accept')}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                            >
                              <MdCheck size={14} className="mr-1" />
                              Terima
                            </button>
                            <button
                              onClick={() => handleActionClick(application, 'reject')}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            >
                              <MdClose size={14} className="mr-1" />
                              Tolak
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            {application.status === 'accepted' ? 'Sudah Diterima' : 'Sudah Ditolak'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {actionModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Konfirmasi {actionType === "accept" ? "Terima" : "Tolak"} Lamaran
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin {actionType === "accept" ? "menerima" : "menolak"} lamaran dari{" "}
              <strong>{selectedApplication.worker_name}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setActionModalOpen(false)}
                disabled={processing}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleActionConfirm}
                disabled={processing}
                className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ${
                  actionType === "accept" 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {actionType === "accept" ? "Menerima..." : "Menolak..."}
                  </>
                ) : (
                  <>
                    {actionType === "accept" ? <MdCheck size={16} /> : <MdClose size={16} />}
                    {actionType === "accept" ? "Terima" : "Tolak"}
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

export default ApplicationPage;