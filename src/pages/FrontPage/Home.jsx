import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from "../../components/compound/carousel/Index";
import WorkerCard from '../../components/compound/card/WorkerCard';
import ExpeditionCard from '../../components/compound/card/ExpeditionCard';
import ProjectCard from '../../components/compound/card/ProjectCard';
import { getWorkers } from '../../services/workerService';
import { getExpedition } from '../../services/expeditionService';
import { getProjects } from '../../services/projectService';
import { useAuth } from '../../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [expeditions, setExpeditions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const [loadingExpeditions, setLoadingExpeditions] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [workerError, setWorkerError] = useState(null);
  const [expeditionError, setExpeditionError] = useState(null);
  const [projectError, setProjectError] = useState(null);
  const [userRole, setUserRole] = useState(null); // null, 'farmer', 'worker', 'driver'

  // Mock auth check - replace with your actual auth logic
  useEffect(() => {
    // Example: Check localStorage or context for user role
    const storedRole = localStorage.getItem('userRole');
    setUserRole(storedRole);
  }, []);

  // Fetch workers data (limited to 10 for home display)
  const fetchWorkers = async () => {
    try {
      setLoadingWorkers(true);
      setWorkerError(null);
      
      const response = await getWorkers();
      
      if (response && response.data) {
        // Take only first 10 items for home display
        setWorkers(response.data.slice(0, 8));
      } else {
        const workerData = Array.isArray(response) ? response.slice(0, 8) : [];
        setWorkers(workerData);
      }
    } catch (err) {
      setWorkerError(err.message || 'Failed to load workers. Please try again.');
      console.error('Error fetching workers:', err);
      setWorkers([]);
    } finally {
      setLoadingWorkers(false);
    }
  };

  // Fetch expeditions data (limited to 10 for home display)
  const fetchExpeditions = async () => {
    try {
      setLoadingExpeditions(true);
      setExpeditionError(null);

      const responseData = await getExpedition();
      
      // Take only first 10 items for home display
      setExpeditions(responseData.data?.slice(0, 8) || []);
    } catch (err) {
      setExpeditionError('Gagal memuat data ekspedisi. Silakan coba lagi.');
      console.error('Error fetching expeditions:', err);
      setExpeditions([]);
    } finally {
      setLoadingExpeditions(false);
    }
  };

  // Fetch projects data (limited to 10 for home display)
  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      setProjectError(null);

      const responseData = await getProjects();
      
      // Take only first 10 items for home display
      setProjects(responseData.data?.data?.slice(0, 8) || []);
    } catch (err) {
      setProjectError('Gagal memuat data proyek. Silakan coba lagi.');
      console.error('Error fetching projects:', err);
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    // Load data based on user role
    if (!userRole) {
      // Not logged in - show all
      fetchWorkers();
      fetchExpeditions();
      fetchProjects();
    } else if (userRole === 'farmer') {
      // Farmer - only workers and expeditions
      fetchWorkers();
      fetchExpeditions();
    } else if (userRole === 'worker' || userRole === 'driver') {
      // Worker/Driver - only projects
      fetchProjects();
    }
  }, [userRole]);

  // Handler functions for WorkerCard
  const handleHireWorker = (worker) => {
    console.log('Hiring worker from home:', worker);
    // You can add navigation to detail page or modal here
  };

  const handleViewWorkerProfile = (worker) => {
    console.log('View worker profile from home:', worker);
    // Navigate to worker detail page
  };

  // Handler functions for ExpeditionCard
  const handleSelectExpedition = (expedition) => {
    console.log('Selected expedition from home:', expedition);
    // You can add navigation to detail page or modal here
  };

  const handleViewExpeditionDetails = (expedition) => {
    console.log('View expedition details from home:', expedition);
    // Navigate to expedition detail page
  };

  // Handler functions for ProjectCard
  const handleApplyProject = (project) => {
    console.log('Applying to project from home:', project);
    // You can add navigation to detail page or modal here
  };

  const handleViewProjectDetails = (project) => {
    console.log('View project details from home:', project);
    // Navigate to project detail page
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md animate-pulse">
      <div className="flex items-start mb-4 space-x-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <div className="flex-1">
          <div className="w-3/4 h-5 mb-2 bg-gray-300 rounded"></div>
          <div className="w-1/2 h-4 mb-2 bg-gray-300 rounded"></div>
          <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="w-full h-4 bg-gray-300 rounded"></div>
        <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
        <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  // Error component
  const ErrorDisplay = ({ error, onRetry }) => (
    <div className="p-6 text-center border border-red-200 rounded-lg bg-red-50">
      <div className="flex items-center justify-center mb-3">
        <svg 
          className="w-8 h-8 text-red-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-red-800">Waduh! Sedang terjadi masalah</h3>
      <p className="mb-4 text-red-600">{error}</p>
      <button 
        className="px-4 py-2 text-sm font-medium text-white transition-opacity duration-200 rounded-md hover:opacity-90"
        style={{ backgroundColor: '#B53939' }}
        onClick={onRetry}
      >
        Coba Lagi
      </button>
    </div>
  );

  // Empty state component
  const EmptyState = ({ title, description, onRetry }) => (
    <div className="p-8 text-center border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex items-center justify-center mb-4">
        <svg 
          className="w-12 h-12 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-700">{title}</h3>
      <p className="mb-4 text-gray-500">{description}</p>
      <button 
        className="px-6 py-2 text-sm font-medium text-white transition-opacity duration-200 rounded-md hover:opacity-90"
        style={{ backgroundColor: '#39B54A' }}
        onClick={onRetry}
      >
        Coba Lagi
      </button>
    </div>
  );

  return (
    <>
      <title>Agro Link - Platform Pertanian Modern Indonesia</title>
      <meta name="description" content="Selamat datang di platform pertanian modern kami." />

      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative w-full max-w-6xl px-4 pt-8 pb-2 mx-auto">
          <Carousel />
        </div>

        {/* Content based on user role */}
        <div className="px-4 py-6 mx-auto space-y-12">
          {/* Show workers and expeditions for farmers or not logged in */}
          {(!userRole || userRole === 'farmer') && (
            <>
              {/* Workers Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Rekomendasi Pekerja Pertanian
                    </h2>
                    <p className="mt-1 text-gray-600">
                      Hubungkan dengan pekerja pertanian berpengalaman untuk proyek Anda
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/worker')}
                    className="inline-flex items-center hidden px-4 py-2 text-sm font-medium text-white transition-opacity duration-200 rounded-lg lg:block hover:opacity-90"
                    style={{ backgroundColor: '#39B54A' }}
                  >
                    Lihat Semua
                  </button>
                </div>

                <button
                    onClick={() => navigate('/worker')}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-opacity duration-200 rounded-lg hover:opacity-90 lg:hidden"
                    style={{ backgroundColor: '#39B54A' }}
                  >
                    Lihat Semua
                </button>

                {/* Worker Cards */}
                {loadingWorkers ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, index) => (
                      <LoadingSkeleton key={`worker-skeleton-${index}`} />
                    ))}
                  </div>
                ) : workerError ? (
                  <ErrorDisplay error={workerError} onRetry={fetchWorkers} />
                ) : !workers || workers.length === 0 ? (
                  <EmptyState 
                    title="Tidak Ada Pekerja Tersedia"
                    description="Kami tidak dapat menemukan pekerja saat ini. Silakan coba lagi nanti atau periksa kembali segera."
                    onRetry={fetchWorkers}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {workers.map((worker, index) => (
                      <WorkerCard
                        key={worker.user_id || index}
                        worker={worker}
                        onHire={() => handleHireWorker(worker)}
                        onViewProfile={() => handleViewWorkerProfile(worker)}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Expeditions Section */}
              {/* <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Rekomendasi Ekspedisi Terpercaya
                    </h2>
                    <p className="mt-1 text-gray-600">
                      Pilih mitra ekspedisi terbaik untuk kebutuhan pengiriman hasil panen
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/expedition')}
                    className="inline-flex items-center hidden px-4 py-2 text-sm font-medium text-white transition-opacity duration-200 rounded-lg lg:block hover:opacity-90"
                    style={{ backgroundColor: '#39B54A' }}
                  >
                    Lihat Semua
                  </button>
                </div>

                <button
                    onClick={() => navigate('/expedition')}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-opacity duration-200 rounded-lg lg:hidden hover:opacity-90"
                    style={{ backgroundColor: '#39B54A' }}
                  >
                  Lihat Semua
                </button> */}

                {/* Expedition Cards */}
                {/* {loadingExpeditions ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, index) => (
                      <LoadingSkeleton key={`expedition-skeleton-${index}`} />
                    ))}
                  </div>
                ) : expeditionError ? (
                  <ErrorDisplay error={expeditionError} onRetry={fetchExpeditions} />
                ) : !expeditions || expeditions.length === 0 ? (
                  <EmptyState 
                    title="Tidak Ada Ekspedisi Tersedia"
                    description="Kami tidak dapat menemukan ekspedisi saat ini. Silakan coba lagi nanti atau periksa kembali segera."
                    onRetry={fetchExpeditions}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {expeditions.map((expedition, index) => (
                      <ExpeditionCard
                        key={expedition.id || index}
                        expedition={expedition}
                        onSelect={() => handleSelectExpedition(expedition)}
                        onViewDetails={() => handleViewExpeditionDetails(expedition)}
                      />
                    ))}
                  </div>
                )}
              </section> */}
            </>
          )}

          {/* Show projects for workers, drivers, or not logged in */}
          {(!userRole || userRole === 'worker' || userRole === 'driver') && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Rekomendasi Proyek Pertanian
                  </h2>
                  <p className="mt-1 text-gray-600">
                    Temukan proyek pertanian yang sesuai dengan keahlian dan jadwal Anda
                  </p>
                </div>
                <button
                  onClick={() => navigate('/projects')}
                  className="inline-flex items-center hidden px-4 py-2 text-sm font-medium text-white transition-opacity duration-200 rounded-lg lg:block hover:opacity-90"
                  style={{ backgroundColor: '#39B54A' }}
                >
                  Lihat Semua
                </button>
              </div>

              <button
                  onClick={() => navigate('/projects')}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-opacity duration-200 rounded-lg hover:opacity-90 lg:hidden"
                  style={{ backgroundColor: '#39B54A' }}
                >
                Lihat Semua
              </button>

              {/* Project Cards */}
              {loadingProjects ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[...Array(8)].map((_, index) => (
                    <LoadingSkeleton key={`project-skeleton-${index}`} />
                  ))}
                </div>
              ) : projectError ? (
                <ErrorDisplay error={projectError} onRetry={fetchProjects} />
              ) : !projects || projects.length === 0 ? (
                <EmptyState 
                  title="Tidak Ada Proyek Tersedia"
                  description="Kami tidak dapat menemukan proyek saat ini. Silakan coba lagi nanti atau periksa kembali segera."
                  onRetry={fetchProjects}
                />
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {projects.map((project, index) => (
                    <ProjectCard
                      key={project.id || index}
                      project={project}
                      onApply={() => handleApplyProject(project)}
                      onViewDetails={() => handleViewProjectDetails(project)}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Call to action for non-authenticated users */}
          {!isAuthenticated && (
            <section className="pt-8 space-y-6 border-t border-gray-200">
              <div className="text-center">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  Bergabunglah dengan <span className='text-secondary'>Agro</span> <span className='text-main'>Link</span>
                </h2>
                <p className="mb-6 text-gray-600">
                  Mulai sekarang untuk mengakses semua fitur platform kami
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <button
                    onClick={() => navigate('/auth/register')}
                    className="px-10 py-3 font-medium transition-colors duration-200 border rounded-full border-main text-main hover:bg-main hover:text-secondary_text"
                  >
                    Mulai Sekarang
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;