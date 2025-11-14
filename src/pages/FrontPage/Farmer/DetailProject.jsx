import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById } from "../../../services/projectService";
import { applyToProject } from "../../../services/applicationService";
import AuthModal from "../../../components/compound/modal/AuthModal";
import ToastNotification from '../../../components/fragments/toast/ToastNotification'; 
import { useToast } from '../../../services/useToast'; 

// Skeleton Components
const SkeletonLine = ({ width = "100%", height = "16px" }) => (
  <div
    className="bg-gray-200 rounded animate-pulse"
    style={{ width, height }}
  ></div>
);

const SkeletonCard = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

const ProjectSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Header Skeleton */}
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div>
                <SkeletonLine width="180px" height="32px" />
                <div className="mt-2">
                  <SkeletonLine width="280px" height="20px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Main Content Skeleton */}
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Info Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Header Skeleton */}
          <SkeletonCard>
            <div className="space-y-4">
              <SkeletonLine width="300px" height="32px" />
              <div className="flex items-center space-x-4">
                <div className="bg-gray-200 px-3 py-1 rounded-full animate-pulse">
                  <SkeletonLine width="60px" height="16px" />
                </div>
                <SkeletonLine width="150px" height="16px" />
              </div>
            </div>
          </SkeletonCard>

          {/* Project Details Skeleton */}
          <SkeletonCard>
            <SkeletonLine width="120px" height="20px" />
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <SkeletonLine width="80px" height="16px" />
                    <SkeletonLine width="120px" height="16px" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Apply Card Skeleton */}
          <SkeletonCard className="sticky top-4">
            <SkeletonLine width="140px" height="20px" />

            <div className="space-y-4 mt-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <SkeletonLine width="90px" height="14px" />
                  <SkeletonLine width="100px" height="16px" />
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  </div>
);

const DetailProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showAlreadyAppliedModal, setShowAlreadyAppliedModal] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null); 
  const { toast, showToast, closeToast } = useToast();

  // Format currency
  const formatPrice = (price) => {
    if (!price || isNaN(price)) return "Belum ditentukan";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Belum ditentukan";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Tanggal tidak valid";

      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return "Tanggal tidak valid";
    }
  };

  // Validate message length (minimum 10 characters)
  const isMessageValid = (message) => {
    return message && message.trim().length >= 10;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case "open":
        return "Terbuka";
      case "in_progress":
        return "Sedang Berlangsung";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status || "Tidak diketahui";
    }
  };

  // Calculate duration
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (error) {
      return 0;
    }
  };

  // Handle apply project submission
  const handleSubmitApplication = async () => {
    if (!isMessageValid(applicationMessage)) {
      showToast('Catatan wajib minimal 10 karakter', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await applyToProject(projectId, { message: applicationMessage }); // Use 'message' attribute
      
      setApplicationStatus('success');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowApplyModal(false);
        setApplicationMessage('');
        setApplicationStatus(null);
      }, 2000);
      
    } catch (error) {
      console.error('Error applying to project:', error);
      
      // Check if error is about already applied
      if (error.message && error.message.includes('already applied')) {
        setApplicationStatus('already_applied');
        // Close application modal and show already applied modal
        setTimeout(() => {
          setShowApplyModal(false);
          setShowAlreadyAppliedModal(true);
          setApplicationStatus(null);
        }, 1500);
      } else {
        setApplicationStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching project with ID:", projectId);
        const response = await getProjectById(projectId);
        console.log("Project detail response:", response);
        // Correct way to set the state
        setProject(response.data);
      } catch (err) {
        setError(
          err.message || "Gagal memuat detail proyek. Silakan coba lagi."
        );
        console.error("Error fetching project details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetail();
    }
  }, [projectId]);

  const handleApplyProject = () => {
    const isUserLoggedIn = localStorage.getItem("token");

    if (isUserLoggedIn) {
      setShowApplyModal(true);
      setApplicationMessage('');
      setApplicationStatus(null);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const closeApplyModal = () => {
    if (!isSubmitting) {
      setShowApplyModal(false);
      setApplicationMessage('');
      setApplicationStatus(null);
    }
  };

  if (loading) {
    return <ProjectSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate("/projects")}
            className="inline-flex items-center px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors"
            style={{ backgroundColor: "#39B54A" }}
          >
            Kembali ke Daftar Proyek
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Proyek tidak ditemukan</p>
          <button
            onClick={() => navigate("/projects")}
            className="inline-flex items-center px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors"
            style={{ backgroundColor: "#39B54A" }}
          >
            Kembali ke Daftar Proyek
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <ToastNotification 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast}
        />
      )}

      <div className="min-h-screen" style={{ backgroundColor: "#F4F4F4" }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/projects")}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div>
                  <h1
                    className="text-3xl font-bold"
                    style={{ color: "#585656" }}
                  >
                    Detail Proyek
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Informasi lengkap tentang proyek pertanian
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold" style={{ color: "#585656" }}>
                  {project.title || "Judul Proyek"}
                </h2>
                <div className="flex items-center space-x-4 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {getStatusText(project.status)}
                  </span>
                  {project.start_date && project.end_date && (
                    <span className="text-sm text-gray-600">
                      Durasi:{" "}
                      {calculateDuration(project.start_date, project.end_date)}{" "}
                      hari
                    </span>
                  )}
                </div>
                {project.description && (
                  <p className="text-gray-700 leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "#585656" }}
              >
                Detail Proyek
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Location - only show if available */}
                {project.location && project.location.trim() && (
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(57, 181, 74, 0.1)" }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: "#39B54A" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: "#585656" }}>
                        Lokasi
                      </p>
                      <p className="text-gray-600">{project.location}</p>
                    </div>
                  </div>
                )}

                {/* Workers Needed */}
                {project.workers_needed && (
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(57, 181, 74, 0.1)" }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: "#39B54A" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: "#585656" }}>
                        Pekerja Dibutuhkan
                      </p>
                      <p className="text-gray-600">
                        {project.workers_needed} orang
                      </p>
                    </div>
                  </div>
                )}

                {/* Start Date */}
                {project.start_date && (
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(57, 181, 74, 0.1)" }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: "#39B54A" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v10a1 1 0 01-1 1H2a1 1 0 01-1-1V8a1 1 0 011-1h6z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: "#585656" }}>
                        Tanggal Mulai
                      </p>
                      <p className="text-gray-600">
                        {formatDate(project.start_date)}
                      </p>
                    </div>
                  </div>
                )}

                {/* End Date */}
                {project.end_date && (
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(57, 181, 74, 0.1)" }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: "#39B54A" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: "#585656" }}>
                        Tanggal Selesai
                      </p>
                      <p className="text-gray-600">
                        {formatDate(project.end_date)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment */}
                {project.payment_rate && (
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(57, 181, 74, 0.1)" }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: "#39B54A" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: "#585656" }}>
                        Pembayaran
                      </p>
                      <p className="text-gray-600">
                        {formatPrice(project.payment_rate)}
                        {project.payment_type &&
                          ` / ${
                            project.payment_type === "per_day" ? "hari" : "jam"
                          }`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-start space-x-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(57, 181, 74, 0.1)" }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: "#39B54A" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: "#585656" }}>
                      Status
                    </p>
                    <p className="text-gray-600">
                      {getStatusText(project.status)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "#585656" }}
              >
                Informasi Pembayaran
              </h3>

              <div className="space-y-4">
                <div
                  className="flex justify-between items-center p-3 rounded-lg"
                  style={{ backgroundColor: "#F4F4F4" }}
                >
                  <span className="text-sm text-gray-600">Tarif</span>
                  <span className="font-semibold" style={{ color: "#585656" }}>
                    {formatPrice(project.payment_rate)}
                  </span>
                </div>

                <div
                  className="flex justify-between items-center p-3 rounded-lg"
                  style={{ backgroundColor: "#F4F4F4" }}
                >
                  <span className="text-sm text-gray-600">Periode</span>
                  <span className="font-semibold" style={{ color: "#585656" }}>
                    Per {project.payment_type === "per_day" ? "Hari" : "Jam"}
                  </span>
                </div>

                {project.start_date && project.end_date && (
                  <div
                    className="flex justify-between items-center p-3 rounded-lg"
                    style={{ backgroundColor: "#F4F4F4" }}
                  >
                    <span className="text-sm text-gray-600">
                      Estimasi Total
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: "#585656" }}
                    >
                      {formatPrice(
                        project.payment_rate *
                          calculateDuration(
                            project.start_date,
                            project.end_date
                          )
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                {project.status === "open" && (
                  <button
                    onClick={handleApplyProject}
                    className="w-full text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-colors"
                    style={{ backgroundColor: "#39B54A" }}
                  >
                    Lamar Proyek Ini
                  </button>
                )}
                {project.status !== "open" && (
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-lg font-medium cursor-not-allowed"
                    style={{ backgroundColor: "#CFCFCF", color: "#585656" }}
                  >
                    {project.status === "in_progress" &&
                      "Proyek Sedang Berlangsung"}
                    {project.status === "completed" && "Proyek Sudah Selesai"}
                    {project.status === "cancelled" && "Proyek Dibatalkan"}
                  </button>
                )}
              </div>
            </div>

            {/* Farmer Info */}
            {project.farmer && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "#585656" }}
                >
                  Informasi Petani
                </h3>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#39B54A" }}
                  >
                    <span className="text-white text-lg font-bold">
                      {project.farmer?.name?.charAt(0)?.toUpperCase() || "P"}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{ color: "#585656" }}>
                      {project.farmer?.name || "Petani"}
                    </h4>
                    <p className="text-sm text-gray-600">Petani</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "#585656" }}
            >
              Lamar Proyek
            </h3>

            {/* Success/Error Messages */}
            {applicationStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-700 font-medium">Lamaran berhasil dikirim!</p>
                </div>
              </div>
            )}

            {applicationStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 font-medium">Gagal mengirim lamaran. Silakan coba lagi.</p>
                </div>
              </div>
            )}

            {applicationStatus === 'already_applied' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-blue-700 font-medium">Mengarahkan ke status lamaran...</p>
                </div>
              </div>
            )}

            {applicationStatus !== 'success' && (
              <>
                <div className="mb-4">
                  <div className="space-y-3 mb-4">
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: "rgba(57, 181, 74, 0.1)" }}
                    >
                      <h4
                        className="font-semibold mb-2"
                        style={{ color: "#585656" }}
                      >
                        {project.title}
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        {project.location && project.location.trim() && (
                          <p>
                            <strong>Lokasi:</strong> {project.location}
                          </p>
                        )}
                        {project.start_date && project.end_date && (
                          <p>
                            <strong>Durasi:</strong>{" "}
                            {calculateDuration(
                              project.start_date,
                              project.end_date
                            )}{" "}
                            hari
                          </p>
                        )}
                        {project.payment_rate && (
                          <p>
                            <strong>Pembayaran:</strong>{" "}
                            {formatPrice(project.payment_rate)} /{" "}
                            {project.payment_type === "per_day" ? "hari" : "jam"}
                          </p>
                        )}
                        {project.payment_rate &&
                          project.start_date &&
                          project.end_date && (
                            <p>
                              <strong>Estimasi Total:</strong>{" "}
                              {formatPrice(
                                project.payment_rate *
                                  calculateDuration(
                                    project.start_date,
                                    project.end_date
                                  )
                              )}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#585656" }}
                    >
                      Catatan untuk Petani (Wajib) *
                    </label>
                    <textarea
                      value={applicationMessage}
                      onChange={(e) => setApplicationMessage(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                      style={{ focusRingColor: "#39B54A" }}
                      rows="4"
                      placeholder="Ceritakan pengalaman atau alasan mengapa Anda cocok untuk proyek ini..."
                      disabled={isSubmitting}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className={`text-xs ${
                        isMessageValid(applicationMessage) 
                          ? 'text-green-600' 
                          : 'text-red-500'
                      }`}>
                        {isMessageValid(applicationMessage) 
                          ? '✓ Catatan memenuhi persyaratan' 
                          : 'Minimal 10 karakter diperlukan'
                        }
                      </p>
                      <span className="text-xs text-gray-500">
                        {applicationMessage.trim().length}/10 minimal
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 text-sm">
                  Dengan melamar proyek ini, Anda menyetujui untuk berkomitmen penuh
                  selama periode proyek berlangsung.
                </p>

                <div className="flex space-x-3">
                  <button
                    onClick={handleSubmitApplication}
                    disabled={isSubmitting || !isMessageValid(applicationMessage)}
                    className={`flex-1 px-4 py-2 text-white text-sm font-medium rounded-md transition-opacity duration-200 ${
                      isSubmitting || !isMessageValid(applicationMessage)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'hover:opacity-90'
                    }`}
                    style={{ 
                      backgroundColor: (!isSubmitting && isMessageValid(applicationMessage)) ? '#39B54A' : undefined 
                    }}
                  >
                    {isSubmitting ? 'Mengirim...' : 'Kirim Lamaran'}
                  </button>
                  <button
                    onClick={closeApplyModal}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Batal
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Already Applied Modal */}
      {showAlreadyAppliedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#585656" }}>
                Sudah Melamar Proyek
              </h3>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-3">
                  Anda sudah mengajukan lamaran untuk proyek <strong>"{project?.title}"</strong> sebelumnya.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-blue-700 text-sm">
                    <strong>Status:</strong> Menunggu konfirmasi dari petani
                  </p>
                </div>
                
                <p className="text-gray-600 text-sm">
                  Mohon menunggu konfirmasi dari petani. Anda akan dihubungi jika lamaran Anda diterima.
                </p>
              </div>

              <button
                onClick={() => setShowAlreadyAppliedModal(false)}
                className="w-full px-4 py-2 text-white text-sm font-medium rounded-md hover:opacity-90 transition-colors"
                style={{ backgroundColor: '#39B54A' }}
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      </div>
    </>
  );
};

export default DetailProject;