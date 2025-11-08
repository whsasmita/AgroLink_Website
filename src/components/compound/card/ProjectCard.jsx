import { useState } from 'react';
import { applyToProject } from '../../../services/applicationService'; 
import AuthModal from '../modal/AuthModal';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


// Modal "Lengkapi Profil"
const CompleteProfileModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          {/* Ikon Peringatan */}
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Lengkapi Profil Anda</h3>
          <p className="mt-3 text-base text-gray-600">
            Anda harus melengkapi biodata pekerja Anda terlebih dahulu sebelum dapat melamar proyek.
          </p>
        </div>
        {/* Tombol Aksi */}
        <div className="flex flex-col-reverse gap-3 mt-8 sm:flex-row sm:justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 font-semibold text-gray-700 transition-all duration-200 bg-gray-200 rounded-xl hover:bg-gray-300"
          >
            Nanti Saja
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 font-semibold text-white transition-all duration-200 shadow-sm bg-main rounded-xl hover:bg-green-600 hover:shadow-md"
          >
            Lengkapi Profil
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, onApplyProject, onViewDetails }) => {
  const navigate = useNavigate();

  // Dapatkan data pengguna dan state modal baru
  const { user } = useAuth(); 
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showAlreadyAppliedModal, setShowAlreadyAppliedModal] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  // Destructure only available fields from API response
  const {
    id,
    title,
    project_type,
    payment_rate,
    payment_type,
    start_date,
    workers_needed
  } = project || {};

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleApplyClick = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    if (user && user.role === 'worker' && !user.worker) {
      setIsProfileModalOpen(true);
    } else {
      setShowApplicationModal(true);
      setApplicationMessage('');
      setApplicationStatus(null);
    }
  };

  // Handle auth modal success (when user successfully logs in)
  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    // After successful login, show the application modal
    setShowApplicationModal(true);
    setApplicationMessage('');
    setApplicationStatus(null);
  };

  // Fungsi untuk navigasi ke halaman edit profil
  const handleGoToProfile = () => {
    navigate('/profile/biography/edit');
    setIsProfileModalOpen(false);
  };

  // Detail button click handler
  const handleViewDetails = () => {
    navigate(`/projects/view/${id}`);
  }

  // Validate message length (minimum 10 characters)
  const isMessageValid = (message) => {
    return message && message.trim().length >= 10;
  };

  // Handle application submission
  const handleSubmitApplication = async () => {
    if (!isMessageValid(applicationMessage)) {
      alert('Catatan wajib minimal 10 karakter');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await applyToProject(id, { message: applicationMessage }); 
      
      setApplicationStatus('success');
      
      // Call parent callback if provided
      if (onApplyProject) {
        onApplyProject(project);
      }
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowApplicationModal(false);
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
          setShowApplicationModal(false);
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

  // Close modal
  const closeModal = () => {
    if (!isSubmitting) {
      setShowApplicationModal(false);
      setApplicationMessage('');
      setApplicationStatus(null);
    }
  };

  return (
    <>
      <div className="w-full p-6 transition-shadow duration-300 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg md:max-w-sm">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="mb-2 text-xl font-bold text-gray-800 line-clamp-2">
              {title}
            </h3>
          </div>
          
          <div className="flex flex-col items-end">
            {/* Show project type if available and not empty */}
            {project_type && project_type.trim() && (
              <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
                {project_type}
              </span>
            )}
          </div>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-gray-50">
            <p className="mb-1 text-xs text-gray-600">Pembayaran</p>
            <p className="font-semibold text-gray-800">
              {payment_rate ? formatCurrency(payment_rate) : 'Belum ditentukan'}
            </p>
            {payment_type && (
              <p className="text-xs text-gray-500">
                per {payment_type.replace('per_', '')}
              </p>
            )}
          </div>
          
          <div className="p-3 rounded-lg bg-gray-50">
            <p className="mb-1 text-xs text-gray-600">Mulai Kerja</p>
            <p className="font-semibold text-gray-800">
              {start_date ? formatDate(start_date) : 'Fleksibel'}
            </p>
          </div>
        </div>

        {/* Workers needed */}
        {workers_needed && (
          <div className="mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 01 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 01 9.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{workers_needed} pekerja dibutuhkan</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleApplyClick}
            className="flex-1 px-4 py-2 text-sm font-medium text-white transition-opacity duration-200 rounded-md hover:opacity-90"
            style={{ backgroundColor: '#39B54A' }}
          >
            Lamar Proyek
          </button>
          
          <button
            onClick={handleViewDetails}
            className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Detail
          </button>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 m-4 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3
              className="mb-4 text-lg font-semibold"
              style={{ color: "#585656" }}
            >
              Konfirmasi Lamaran Proyek
            </h3>

            <div className="mb-6">
              <h4 className="mb-2 font-medium text-gray-900">
                {title}
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                {payment_rate && (
                  <p>
                    <span className="font-medium">Pembayaran:</span>{" "}
                    {formatCurrency(payment_rate)}
                    {payment_type && ` per ${payment_type.replace("per_", "")}`}
                  </p>
                )}
                {start_date && (
                  <p>
                    <span className="font-medium">Mulai:</span>{" "}
                    {formatDate(start_date)}
                  </p>
                )}
                {workers_needed && (
                  <p>
                    <span className="font-medium">Pekerja dibutuhkan:</span>{" "}
                    {workers_needed} orang
                  </p>
                )}
              </div>
            </div>

            {/* Success/Error Messages */}
            {applicationStatus === 'success' && (
              <div className="p-4 mb-6 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium text-green-700">Lamaran berhasil dikirim!</p>
                </div>
              </div>
            )}

            {applicationStatus === 'error' && (
              <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium text-red-700">Gagal mengirim lamaran. Silakan coba lagi.</p>
                </div>
              </div>
            )}

            {applicationStatus === 'already_applied' && (
              <div className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium text-blue-700">Mengarahkan ke status lamaran...</p>
                </div>
              </div>
            )}

            {applicationStatus !== 'success' && applicationStatus !== 'already_applied' && (
              <>
                <div className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex">
                    <svg
                      className="w-5 h-5 text-blue-400 mt-0.5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="text-sm text-blue-700">
                      <p className="mb-1 font-medium">Informasi Penting:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>
                          Pastikan Anda dapat berkomitmen penuh pada jadwal proyek
                        </li>
                        <li>Lamaran akan diproses dalam 1-2 hari kerja</li>
                        <li>Anda akan dihubungi jika terpilih</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="applicationMessage" className="block mb-2 text-sm font-medium text-gray-700">
                    Catatan Wajib *
                  </label>
                  <textarea
                    id="applicationMessage"
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    placeholder="Ceritakan mengapa Anda tertarik dengan proyek ini dan pengalaman relevan yang Anda miliki..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                    style={{ focusRingColor: '#39B54A' }}
                    rows={4}
                    disabled={isSubmitting}
                  />
                  <div className="flex items-center justify-between mt-1">
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

                <p className="mb-6 text-sm text-gray-600">
                  Apakah Anda yakin ingin melamar proyek{" "}
                  <strong>"{title}"</strong>? Pastikan Anda telah
                  membaca semua persyaratan dengan teliti.
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
                    {isSubmitting ? 'Mengirim...' : 'Ya, Lamar Proyek'}
                  </button>
                  <button
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 m-4 bg-white rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h3 className="mb-2 text-lg font-semibold" style={{ color: "#585656" }}>
                Sudah Melamar Proyek
              </h3>
              
              <div className="mb-4">
                <p className="mb-3 text-gray-600">
                  Anda sudah mengajukan lamaran untuk proyek ini sebelumnya.
                </p>
                
                <div className="p-3 mb-4 border border-blue-200 rounded-lg bg-blue-50">
                  <p className="text-sm text-blue-700">
                    <strong>Status:</strong> Menunggu konfirmasi dari petani
                  </p>
                </div>
                
                <p className="text-sm text-gray-600">
                  Mohon menunggu konfirmasi dari petani. Anda akan dihubungi jika lamaran Anda diterima.
                </p>
              </div>

              <button
                onClick={() => setShowAlreadyAppliedModal(false)}
                className="w-full px-4 py-2 text-sm font-medium text-white transition-colors rounded-md hover:opacity-90"
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
        onAuthSuccess={handleAuthSuccess}
      />

    
      {/* Modal "Lengkapi Profil" */}
      <CompleteProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onConfirm={handleGoToProfile}
      />
    </>
  );
};

export default ProjectCard;