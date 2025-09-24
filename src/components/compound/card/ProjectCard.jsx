import { useState } from 'react';
import { applyToProject } from '../../../services/applicationService'; // Import the API function

const ProjectCard = ({ project, onApplyProject, onViewDetails }) => {
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showAlreadyAppliedModal, setShowAlreadyAppliedModal] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null); // 'success' | 'error' | 'already_applied'

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

  // Handle apply button click
  const handleApplyClick = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login or show login modal
      // You might want to implement this based on your auth system
      alert('Silakan login terlebih dahulu untuk melamar proyek');
      return;
    }
    
    setShowApplicationModal(true);
    setApplicationMessage('');
    setApplicationStatus(null);
  };

  // Debug function to check project data
  const debugProject = () => {
    console.log('Project data:', project);
    console.log('Project ID:', id);
    console.log('Full project object:', JSON.stringify(project, null, 2));
  };

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
      await applyToProject(id, { message: applicationMessage }); // Use 'message' attribute
      
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
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
              {title}
            </h3>
          </div>
          
          <div className="flex flex-col items-end">
            {/* Show project type if available and not empty */}
            {project_type && project_type.trim() && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                {project_type}
              </span>
            )}
          </div>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Pembayaran</p>
            <p className="font-semibold text-gray-800">
              {payment_rate ? formatCurrency(payment_rate) : 'Belum ditentukan'}
            </p>
            {payment_type && (
              <p className="text-xs text-gray-500">
                per {payment_type.replace('per_', '')}
              </p>
            )}
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Mulai Kerja</p>
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
            className="flex-1 px-4 py-2 text-white text-sm font-medium rounded-md transition-opacity duration-200 hover:opacity-90"
            style={{ backgroundColor: '#39B54A' }}
          >
            Lamar Proyek
          </button>
          
          <button
            onClick={() => {
              debugProject(); // Add debug log
              onViewDetails && onViewDetails(project);
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Detail
          </button>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "#585656" }}
            >
              Konfirmasi Lamaran Proyek
            </h3>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">
                {title}
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
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

            {applicationStatus !== 'success' && applicationStatus !== 'already_applied' && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
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
                      <p className="font-medium mb-1">Informasi Penting:</p>
                      <ul className="list-disc list-inside space-y-1">
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
                  <label htmlFor="applicationMessage" className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Wajib *
                  </label>
                  <textarea
                    id="applicationMessage"
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    placeholder="Ceritakan mengapa Anda tertarik dengan proyek ini dan pengalaman relevan yang Anda miliki..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-opacity-50 focus:border-transparent resize-none"
                    style={{ focusRingColor: '#39B54A' }}
                    rows={4}
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

                <p className="text-gray-600 mb-6 text-sm">
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
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                  Anda sudah mengajukan lamaran untuk proyek ini sebelumnya.
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
    </>
  );
};

export default ProjectCard;