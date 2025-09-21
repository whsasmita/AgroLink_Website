import { useState, useEffect } from 'react';
import ProjectList from '../../../components/fragments/list/ProjectList';
import { getProjects } from '../../../services/projectService';

const ListProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 12,
    offset: 0,
    total_pages: 1,
    total_records: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [appliedProjects, setAppliedProjects] = useState(new Set());
  
  // Store original projects data for search functionality
  const [originalProjects, setOriginalProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const responseData = await getProjects();
      console.log('Raw API Response:', responseData); // Debug log

      // Fix: Use the same data structure as Home component
      // Check multiple possible data structures
      let projectsData = [];
      
      if (responseData?.data?.data && Array.isArray(responseData.data.data)) {
        // Structure: { data: { data: [...projects], pagination: {...} } }
        projectsData = responseData.data.data;
        if (responseData.data.pagination) {
          setPagination(responseData.data.pagination);
        }
      } else if (responseData?.data && Array.isArray(responseData.data)) {
        // Structure: { data: [...projects] }
        projectsData = responseData.data;
      } else if (Array.isArray(responseData)) {
        // Structure: [...projects]
        projectsData = responseData;
      }

      setProjects(projectsData); 
      setOriginalProjects(projectsData); // Store original data
      
      console.log('Processed projects data:', projectsData); // Debug log

    } catch (err) {
      setError('Gagal memuat data proyek. Silakan coba lagi.');
      console.error('Error fetching projects:', err);
      // Ensure projects is always an array even on error
      setProjects([]);
      setOriginalProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      // Reset to original projects when search is empty
      setProjects(originalProjects);
    } else {
      // Ensure originalProjects is an array before filtering
      if (Array.isArray(originalProjects)) {
        const filteredProjects = originalProjects.filter(project => 
          project?.title?.toLowerCase().includes(query.toLowerCase()) ||
          project?.description?.toLowerCase().includes(query.toLowerCase()) ||
          project?.location?.toLowerCase().includes(query.toLowerCase()) ||
          project?.project_type?.toLowerCase().includes(query.toLowerCase()) ||
          project?.farmer_name?.toLowerCase().includes(query.toLowerCase()) ||
          (Array.isArray(project?.required_skills) && project.required_skills.some(skill => 
            skill?.toLowerCase().includes(query.toLowerCase())
          ))
        );
        setProjects(filteredProjects);
      } else {
        // Fallback: fetch fresh data if originalProjects is not available
        await fetchProjects();
      }
    }
  };

  const handleApplyProject = (project) => {
    setSelectedProject(project);
    console.log('Apply to project:', project);
  };

  const handleViewDetails = (project) => {
    console.log('View details for project:', project);
    // Navigate to project details page
    // Example: navigate(`/projects/${project.project_id}`);
  };

  const handleConfirmApplication = () => {
    if (selectedProject) {
      // Add application logic here
      setAppliedProjects(prev => new Set(prev).add(selectedProject.project_id));
      console.log('Application submitted for:', selectedProject.title);
      setSelectedProject(null);
      
      // Show success message or redirect
      // You might want to show a toast notification here
    }
  };

  // Calculate stats - ensure projects is always an array
  const safeProjects = Array.isArray(projects) ? projects : [];

  const urgentProjects = safeProjects.filter(project => {
    if (!project?.start_date) return false;
    
    try {
      const start = new Date(project.start_date);
      const today = new Date();
      const diffTime = start - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 3;
    } catch (error) {
      return false;
    }
  }).length;

  const activeProjects = safeProjects.filter(p => p?.status === 'active').length;
  
  const highPayingProjects = safeProjects.filter(p => 
    p?.payment_rate && p.payment_rate >= 100000
  ).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F4F4' }}>
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#585656' }}>
                Temukan Proyek Anda
              </h1>
              <p className="text-gray-600 mt-2">
                Pilih dari berbagai proyek pertanian yang tersedia dan mulai bekerja hari ini
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex-shrink-0 lg:w-96">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg 
                    className="h-5 w-5 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cari proyek, lokasi, atau jenis pekerjaan..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                  style={{ 
                    focusRingColor: '#39B54A',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Information - Remove this in production */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="container mx-auto px-4 py-2">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-sm">
            <strong>Debug Info:</strong> Projects count: {safeProjects.length}, 
            Loading: {loading.toString()}, 
            Error: {error || 'None'}
          </div>
        </div>
      )} */}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#39B54A' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Proyek</p>
                <p className="text-lg font-semibold" style={{ color: '#585656' }}>
                  {pagination?.total_records || safeProjects.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#F59E0B' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Proyek Urgent</p>
                <p className="text-lg font-semibold" style={{ color: '#585656' }}>
                  {urgentProjects}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#7ED957' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Proyek Aktif</p>
                <p className="text-lg font-semibold" style={{ color: '#585656' }}>
                  {activeProjects}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#10B981' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Gaji Tinggi (100K+)</p>
                <p className="text-lg font-semibold" style={{ color: '#585656' }}>
                  {highPayingProjects}
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Project List */}
        <ProjectList
          projects={safeProjects}
          loading={loading}
          error={error}
          onApplyProject={handleApplyProject}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* Application Confirmation Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#585656' }}>
              Konfirmasi Lamaran Proyek
            </h3>
            
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">{selectedProject.title}</h4>
              <div className="text-sm text-gray-600 space-y-1">
                {selectedProject.farmer_name && (
                  <p><span className="font-medium">Petani:</span> {selectedProject.farmer_name}</p>
                )}
                {selectedProject.location && (
                  <p><span className="font-medium">Lokasi:</span> {selectedProject.location}</p>
                )}
                {selectedProject.payment_rate && (
                  <p><span className="font-medium">Pembayaran:</span> {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(selectedProject.payment_rate)} {selectedProject.payment_type && `per ${selectedProject.payment_type.replace('per_', '')}`}</p>
                )}
                {selectedProject.start_date && (
                  <p><span className="font-medium">Mulai:</span> {new Date(selectedProject.start_date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</p>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Informasi Penting:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Pastikan Anda dapat berkomitmen penuh pada jadwal proyek</li>
                    <li>Lamaran akan diproses dalam 1-2 hari kerja</li>
                    <li>Anda akan dihubungi jika terpilih</li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin melamar proyek <strong>"{selectedProject.title}"</strong>? 
              Pastikan Anda telah membaca semua persyaratan dengan teliti.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={handleConfirmApplication}
                className="flex-1 px-4 py-2 text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity duration-200"
                style={{ backgroundColor: '#39B54A' }}
              >
                Ya, Lamar Proyek
              </button>
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {appliedProjects.size > 0 && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Lamaran berhasil dikirim!
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProject;