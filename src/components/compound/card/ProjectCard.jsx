import { useState } from 'react';
import { Calendar, DollarSign, Clock, MapPin, User } from 'lucide-react';
import AuthModal from '../modal/AuthModal';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, onApply, onViewDetails }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format payment type
  const formatPaymentType = (type) => {
    const paymentTypes = {
      'per_day': 'per hari',
      'per_week': 'per minggu',
      'per_month': 'per bulan',
      'per_project': 'per proyek',
      'per_hour': 'per jam',
    };
    return paymentTypes[type] || type;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Tidak ditentukan';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Tanggal tidak valid';
    }
  };

  // Calculate days until start
  const getDaysUntilStart = (startDate) => {
    if (!startDate) return null;
    
    try {
      const start = new Date(startDate);
      const today = new Date();
      const diffTime = start - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'Sudah dimulai';
      if (diffDays === 0) return 'Dimulai hari ini';
      if (diffDays === 1) return 'Dimulai besok';
      return `${diffDays} hari lagi`;
    } catch (error) {
      return null;
    }
  };

  // Function untuk handle klik lamar proyek
  const handleApplyProject = () => {
    // Cek apakah user sudah login (Anda bisa sesuaikan dengan sistem auth Anda)
    const isUserLoggedIn = localStorage.getItem('user_token'); // Contoh pengecekan
    
    if (isUserLoggedIn) {
      // Jika sudah login, lakukan aksi lamar proyek
      console.log('User sudah login, proses lamar proyek');
      // Panggil function onApply yang diterima dari props
      if (onApply) {
        onApply(project);
      }
    } else {
      // Jika belum login, tampilkan modal auth
      setIsAuthModalOpen(true);
    }
  };

  const daysUntilStart = getDaysUntilStart(project?.start_date);
  const isUrgent = project?.start_date && getDaysUntilStart(project.start_date)?.includes('hari lagi') && parseInt(getDaysUntilStart(project.start_date)) <= 3;

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {project?.title || 'Judul Proyek Tidak Tersedia'}
            </h3>
            
            {project?.project_type && (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
                {project.project_type}
              </span>
            )}
          </div>
          
          {isUrgent && (
            <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
              Urgent
            </span>
          )}
        </div>

        {/* Project Details */}
        <div className="space-y-3 mb-4">
          {/* Payment Information */}
          <div className="flex items-center text-gray-600">
            <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold text-green-600">
                {project?.payment_rate ? formatCurrency(project.payment_rate) : 'Tidak ditentukan'}
              </span>
              {project?.payment_type && (
                <span className="text-sm text-gray-500">
                  {formatPaymentType(project.payment_type)}
                </span>
              )}
            </div>
          </div>

          {/* Start Date */}
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-sm">
                {formatDate(project?.start_date)}
              </span>
              {daysUntilStart && (
                <span className={`text-xs ${isUrgent ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                  {daysUntilStart}
                </span>
              )}
            </div>
          </div>

          {/* Project Duration (if available) */}
          {project?.duration && (
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{project.duration}</span>
            </div>
          )}

          {/* Location (if available) */}
          {project?.location && (
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{project.location}</span>
            </div>
          )}

          {/* Client/Farmer (if available) */}
          {project?.farmer_name && (
            <div className="flex items-center text-gray-600">
              <User className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{project.farmer_name}</span>
            </div>
          )}
        </div>

        {/* Description (if available) */}
        {project?.description && (
          <div className="mb-4">
            <p className="text-gray-600 text-sm line-clamp-2">
              {project.description}
            </p>
          </div>
        )}

        {/* Tags/Skills (if available) */}
        {project?.required_skills && project.required_skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {project.required_skills.slice(0, 3).map((skill, index) => (
                <span 
                  key={index}
                  className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
                >
                  {skill}
                </span>
              ))}
              {project.required_skills.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                  +{project.required_skills.length - 3} lainnya
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <Link
            to={`/projects/${project?.id}`}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Lihat Detail
          </Link>
          <button
            onClick={handleApplyProject}
            className="flex-1 px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-opacity duration-200"
            style={{ backgroundColor: '#39B54A' }}
          >
            Lamar Proyek
          </button>
        </div>

        {/* Project Status Indicator (if available) */}
        {project?.status && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Status:</span>
              <span className={`font-medium ${
                project.status === 'active' ? 'text-green-600' :
                project.status === 'pending' ? 'text-yellow-600' :
                project.status === 'completed' ? 'text-blue-600' :
                'text-gray-600'
              }`}>
                {project.status === 'active' ? 'Aktif' :
                 project.status === 'pending' ? 'Menunggu' :
                 project.status === 'completed' ? 'Selesai' :
                 project.status}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default ProjectCard;