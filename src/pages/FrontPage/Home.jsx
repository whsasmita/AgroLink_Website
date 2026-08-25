import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from "../../components/compound/carousel/Index";
import WorkerCard from '../../components/compound/card/WorkerCard';
import ProjectCard from '../../components/compound/card/ProjectCard';
import ProductCard from '../../components/compound/card/ProductCard';
import { getWorkers } from '../../services/workerService';
import { getProjects } from '../../services/projectService';
import { getProducts } from '../../services/productServices';
import { useAuth } from '../../contexts/AuthContext';
import {
  Briefcase,
  Users,
  ShoppingBag,
  Sparkles,
  Search,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Building2,
  Handshake,
  TrendingUp,
  Layers,
  RotateCcw,
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const userRole = user?.role || null;

  // Data states
  const [workers, setWorkers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);

  // Loading states
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Error states
  const [workerError, setWorkerError] = useState(null);
  const [projectError, setProjectError] = useState(null);
  const [productError, setProductError] = useState(null);

  // Modern Filter States
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'projects', 'workers', 'products'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'agriculture', 'livestock', 'construction'

  // Categories list
  const categoryOptions = [
    { id: 'all', label: 'Semua Bidang' },
    { id: 'agriculture', label: '🌾 Pertanian' },
    { id: 'livestock', label: '🐄 Peternakan' },
    { id: 'construction', label: '🔨 Konstruksi / Tukang' },
  ];

  // Set smart default tab based on user role when logged in
  useEffect(() => {
    if (userRole === 'farmer') {
      setActiveTab('workers');
    } else if (userRole === 'worker' || userRole === 'driver') {
      setActiveTab('projects');
    } else if (userRole === 'mitra') {
      setActiveTab('all');
    } else {
      setActiveTab('all');
    }
  }, [userRole]);

  // Fetch workers
  const fetchWorkersData = useCallback(async () => {
    setLoadingWorkers(true);
    setWorkerError(null);
    try {
      const response = await getWorkers({
        sort_by: "total_jobs_completed",
        order: "desc",
        limit: 8,
      });
      if (response && response.data) {
        setWorkers(response.data.slice(0, 8));
      } else {
        const workerData = Array.isArray(response) ? response.slice(0, 8) : [];
        setWorkers(workerData);
      }
    } catch (err) {
      console.error('Error fetching workers:', err);
      setWorkerError(err.message || 'Gagal memuat data pekerja.');
      setWorkers([]);
    } finally {
      setLoadingWorkers(false);
    }
  }, []);

  // Fetch projects
  const fetchProjectsData = useCallback(async () => {
    setLoadingProjects(true);
    setProjectError(null);
    try {
      const responseData = await getProjects();
      setProjects(responseData.data?.data?.slice(0, 8) || responseData.data?.slice(0, 8) || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setProjectError('Gagal memuat data lowongan proyek.');
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  // Fetch products
  const fetchProductsData = useCallback(async () => {
    setLoadingProducts(true);
    setProductError(null);
    try {
      const response = await getProducts();
      if (response && response.data) {
        setProducts(response.data.slice(0, 8));
      } else if (Array.isArray(response)) {
        setProducts(response.slice(0, 8));
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setProductError('Gagal memuat produk pasar.');
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // Initial fetch for all modules
  useEffect(() => {
    fetchWorkersData();
    fetchProjectsData();
    fetchProductsData();
  }, [fetchWorkersData, fetchProjectsData, fetchProductsData]);

  // Filtered workers
  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const matchesSearch =
        !searchQuery ||
        worker.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (typeof worker.skills === 'string' && worker.skills.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesCategory = true;
      if (selectedCategory !== 'all') {
        let skillsList = [];
        try {
          skillsList = typeof worker.skills === 'string' ? JSON.parse(worker.skills) : worker.skills;
        } catch {
          skillsList = [];
        }
        matchesCategory = Array.isArray(skillsList) && skillsList.includes(selectedCategory);
      }

      return matchesSearch && matchesCategory;
    });
  }, [workers, searchQuery, selectedCategory]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        !searchQuery ||
        project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.farmer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' ||
        project.project_type === selectedCategory ||
        project.type === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const name = prod.title || prod.name || "";
      const farmer = prod.farmer_name || prod.farmer?.name || "";
      const category = prod.category || "";
      const matchesSearch =
        !searchQuery ||
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [products, searchQuery]);

  // Get user role display metadata
  const getRoleBadge = (role) => {
    switch (role) {
      case 'farmer':
        return {
          label: 'Pemberi Kerja',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          desc: 'Kelola proyek pertanian, pekerjakan tenaga terampil, dan pasarkan hasil panen Anda.',
        };
      case 'mitra':
        return {
          label: 'Mitra Bisnis (B2B)',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          desc: 'Jalin kerja sama komoditas B2B, pasokan hasil tani, dan kelola kontrak legal terpercaya.',
        };
      case 'worker':
        return {
          label: 'Pekerja Pertanian',
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          desc: 'Temukan lowongan proyek terverifikasi dengan kompensasi transparan dan aman.',
        };
      case 'driver':
        return {
          label: 'Mitra Ekspedisi',
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          desc: 'Dapatkan order pengiriman hasil panen dan logistik pertanian di sekitar Anda.',
        };
      default:
        return {
          label: 'Pengguna Umum',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          desc: 'Beli hasil bumi segar langsung dari petani terbaik di seluruh Indonesia.',
        };
    }
  };

  // Modern Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm animate-pulse space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
          <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="w-full h-3 bg-gray-200 rounded"></div>
        <div className="w-4/5 h-3 bg-gray-200 rounded"></div>
      </div>
      <div className="w-full h-9 bg-gray-200 rounded-xl"></div>
    </div>
  );

  // Modern Error Component
  const ErrorDisplay = ({ error, onRetry }) => (
    <div className="p-8 text-center border border-red-100 rounded-2xl bg-red-50/50 max-w-lg mx-auto space-y-3">
      <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto">
        <RotateCcw size={24} />
      </div>
      <h3 className="text-base font-semibold text-red-800">Gagal Memuat Konten</h3>
      <p className="text-sm text-red-600">{error}</p>
      <button
        onClick={onRetry}
        className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm"
      >
        Coba Lagi
      </button>
    </div>
  );

  // Modern Empty State
  const EmptyState = ({ title, description }) => (
    <div className="p-10 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/60 max-w-md mx-auto space-y-3">
      <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
        <Layers size={24} />
      </div>
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );

  return (
    <>
      <title>Agro Link - Platform Ekosistem Pertanian Modern</title>
      <meta
        name="description"
        content="Platform ekosistem agrikultur terintegrasi untuk pemberi kerja, pekerja terampil, mitra bisnis B2B, dan ekspedisi."
      />

      <div className="min-h-screen bg-slate-50/40 pb-16">
        {/* Hero Section Carousel (Unmodified) */}
        <div className="relative w-full max-w-7xl px-4 pt-6 pb-2 mx-auto">
          <Carousel />
        </div>

        <div className="max-w-7xl px-4 mx-auto space-y-8 mt-4">
          {/* Logged-in Personalized Welcome Banner */}
          {isAuthenticated && user && (
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-green-900/10 border border-green-600/30">
              <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20">
                      Ekosistem AgroLink
                    </span>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full border ${getRoleBadge(userRole).color} bg-white`}
                    >
                      {getRoleBadge(userRole).label}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Selamat datang kembali, {user.name} 👋
                  </h1>
                  <p className="text-sm sm:text-base text-green-100/90 leading-relaxed">
                    {getRoleBadge(userRole).desc}
                  </p>
                </div>

                {/* Quick Action Buttons based on Role */}
                <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
                  {userRole === 'farmer' && (
                    <>
                      <button
                        onClick={() => navigate('/dashboard/projects/create')}
                        className="px-4 py-2.5 bg-white text-emerald-800 text-sm font-semibold rounded-xl hover:bg-green-50 shadow-md transition-all duration-200"
                      >
                        + Buat Lowongan
                      </button>
                      <button
                        onClick={() => navigate('/worker')}
                        className="px-4 py-2.5 bg-green-600/60 hover:bg-green-600 text-white text-sm font-semibold rounded-xl border border-white/20 transition-all"
                      >
                        Cari Pekerja
                      </button>
                    </>
                  )}

                  {userRole === 'mitra' && (
                    <>
                      <button
                        onClick={() => navigate('/mitra/cooperations')}
                        className="px-4 py-2.5 bg-white text-blue-800 text-sm font-semibold rounded-xl hover:bg-blue-50 shadow-md transition-all duration-200 flex items-center gap-1.5"
                      >
                        <Handshake size={16} /> Kerja Sama B2B
                      </button>
                      <button
                        onClick={() => navigate('/product')}
                        className="px-4 py-2.5 bg-blue-600/60 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl border border-white/20 transition-all"
                      >
                        Pasar Hasil Panen
                      </button>
                    </>
                  )}

                  {(userRole === 'worker' || userRole === 'driver') && (
                    <>
                      <button
                        onClick={() => navigate('/projects')}
                        className="px-4 py-2.5 bg-white text-emerald-800 text-sm font-semibold rounded-xl hover:bg-green-50 shadow-md transition-all duration-200"
                      >
                        Cari Lowongan
                      </button>
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2.5 bg-green-600/60 hover:bg-green-600 text-white text-sm font-semibold rounded-xl border border-white/20 transition-all"
                      >
                        Dashboard Saya
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => navigate('/product')}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl backdrop-blur-md border border-white/20 transition-all"
                  >
                    Pasar Tani
                  </button>
                </div>
              </div>

              {/* Subtle background glow */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            </div>
          )}

          {/* Modern Interactive Filter & Search Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                {[
                  { id: 'all', label: 'Semua Rekomendasi', icon: Sparkles },
                  { id: 'projects', label: 'Lowongan Proyek', icon: Briefcase },
                  { id: 'workers', label: 'Pekerja Terampil', icon: Users },
                  { id: 'products', label: 'Pasar & Hasil Tani', icon: ShoppingBag },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-2xl whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? 'bg-main text-white shadow-md shadow-green-600/20 scale-[1.02]'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                      }`}
                    >
                      <Icon size={16} className={isActive ? 'text-white' : 'text-gray-500'} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search Box & Sector Filter */}
              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                {/* Sector Selector */}
                {(activeTab === 'all' || activeTab === 'projects' || activeTab === 'workers') && (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3.5 py-2.5 text-xs sm:text-sm font-medium bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 focus:ring-2 focus:ring-main focus:border-transparent cursor-pointer"
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {/* Quick Search */}
                <div className="relative flex-1 sm:w-64">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari kata kunci..."
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-800 focus:ring-2 focus:ring-main focus:border-transparent placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Lowongan Proyek Pertanian */}
          {(activeTab === 'all' || activeTab === 'projects') && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-green-100 text-main rounded-lg">
                      <Briefcase size={18} />
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Lowongan Proyek Pertanian
                    </h2>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500">
                    Peluang kerja pertanian terbaru langsung dari Pemberi Kerja terpercaya
                  </p>
                </div>
                <button
                  onClick={() => navigate('/projects')}
                  className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-main hover:text-green-700 transition-colors group"
                >
                  Lihat Semua
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>

              {loadingProjects ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[...Array(4)].map((_, index) => (
                    <LoadingSkeleton key={`proj-skel-${index}`} />
                  ))}
                </div>
              ) : projectError ? (
                <ErrorDisplay error={projectError} onRetry={fetchProjectsData} />
              ) : filteredProjects.length === 0 ? (
                <EmptyState
                  title="Tidak Ada Proyek Ditemukan"
                  description="Tidak ada lowongan proyek yang sesuai dengan kriteria pencarian Anda saat ini."
                />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProjects.map((project, index) => (
                    <div
                      key={project.id || index}
                      className="transition-all duration-300 hover:-translate-y-1"
                    >
                      <ProjectCard project={project} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Section 2: Pekerja Pertanian Terampil */}
          {(activeTab === 'all' || activeTab === 'workers') && (
            <section className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                      <Users size={18} />
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Pekerja Pertanian Terampil
                    </h2>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500">
                    Tenaga kerja berpengalaman di bidang pertanian, peternakan, dan pertukangan
                  </p>
                </div>
                <button
                  onClick={() => navigate('/worker')}
                  className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-main hover:text-green-700 transition-colors group"
                >
                  Lihat Semua
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>

              {loadingWorkers ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[...Array(4)].map((_, index) => (
                    <LoadingSkeleton key={`worker-skel-${index}`} />
                  ))}
                </div>
              ) : workerError ? (
                <ErrorDisplay error={workerError} onRetry={fetchWorkersData} />
              ) : filteredWorkers.length === 0 ? (
                <EmptyState
                  title="Tidak Ada Pekerja Ditemukan"
                  description="Tidak ada profil pekerja yang sesuai dengan kata kunci atau filter bidang saat ini."
                />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredWorkers.map((worker, index) => (
                    <div
                      key={worker.user_id || index}
                      className="transition-all duration-300 hover:-translate-y-1"
                    >
                      <WorkerCard worker={worker} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Section 3: Produk Hasil Tani Pasar */}
          {(activeTab === 'all' || activeTab === 'products') && (
            <section className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                      <ShoppingBag size={18} />
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Komoditas & Produk Pertanian
                    </h2>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500">
                    Hasil panen segar dan produk tani berkualitas langsung dari petani lokal
                  </p>
                </div>
                <button
                  onClick={() => navigate('/product')}
                  className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-main hover:text-green-700 transition-colors group"
                >
                  Buka Pasar
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>

              {loadingProducts ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[...Array(4)].map((_, index) => (
                    <LoadingSkeleton key={`prod-skel-${index}`} />
                  ))}
                </div>
              ) : productError ? (
                <ErrorDisplay error={productError} onRetry={fetchProductsData} />
              ) : filteredProducts.length === 0 ? (
                <EmptyState
                  title="Tidak Ada Produk Ditemukan"
                  description="Belum ada komoditas atau produk yang sesuai dengan pencarian."
                />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => {
                    const productImage =
                      (Array.isArray(product.image_urls) && product.image_urls[0]) ||
                      product.image_url ||
                      product.image ||
                      (Array.isArray(product.images) && product.images[0]) ||
                      "";

                    return (
                      <div
                        key={product.id}
                        className="transition-all duration-300 hover:-translate-y-1"
                      >
                        <ProductCard
                          id={product.id}
                          name={product.title || product.name || "Produk Pertanian"}
                          rating={product.rating || "5.0"}
                          image={productImage}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* Call to action for guests */}
          {!isAuthenticated && (
            <section className="pt-8 space-y-6 border-t border-gray-200">
              <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 p-8 sm:p-12 rounded-3xl border border-green-100 text-center space-y-4 shadow-sm">
                <div className="inline-flex p-3 bg-white text-main rounded-2xl shadow-sm mb-2">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Bergabunglah dengan Ekosistem <span className="text-secondary">Agro</span>{' '}
                  <span className="text-main">Link</span>
                </h2>
                <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
                  Daftar sekarang sebagai Pemberi Kerja, Pekerja Terampil, Mitra Bisnis B2B, atau Ekspedisi untuk mengembangkan usaha agrikultur Anda.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                  <button
                    onClick={() => navigate('/auth/register')}
                    className="px-8 py-3.5 text-sm font-semibold text-white bg-main hover:bg-green-600 rounded-2xl shadow-md hover:shadow-lg transition-all"
                  >
                    Daftar Sekarang Gratis
                  </button>
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="px-8 py-3.5 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl transition-colors"
                  >
                    Masuk ke Akun
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