import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMyFarms } from '../../../../services/farmerService';
import { MdArrowBack } from 'react-icons/md';

// Skeleton Components
const SkeletonCard = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

const SkeletonLine = ({ width = "w-full", height = "h-4" }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${width} ${height}`}></div>
);

const SkeletonBox = ({ width = "w-full", height = "h-4" }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${width} ${height}`}></div>
);

const LoadingSkeleton = () => (
  <div className="p-4 md:p-6 max-w-7xl mx-auto">
    {/* Header Skeleton */}
    <SkeletonCard className="mb-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div className="flex-1">
          <SkeletonLine width="w-3/4" height="h-8" />
          <div className="mt-2">
            <SkeletonLine width="w-1/2" height="h-4" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 lg:items-center">
          <SkeletonBox width="w-20" height="h-8" />
        </div>
      </div>
    </SkeletonCard>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Informasi Lahan Skeleton */}
      <SkeletonCard>
        <div className="flex items-center mb-4">
          <div className="w-2 h-6 bg-gray-200 rounded-full mr-3 animate-pulse"></div>
          <SkeletonLine width="w-1/3" height="h-6" />
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <SkeletonLine width="w-1/2" height="h-4" />
              <div className="mt-2">
                <SkeletonLine width="w-3/4" height="h-6" />
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <SkeletonLine width="w-1/2" height="h-4" />
              <div className="mt-2">
                <SkeletonLine width="w-3/4" height="h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <SkeletonLine width="w-1/3" height="h-4" />
            <div className="mt-2">
              <SkeletonLine width="w-2/3" height="h-5" />
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <SkeletonLine width="w-1/4" height="h-4" />
            <div className="mt-2 space-y-2">
              <SkeletonLine width="w-full" height="h-4" />
              <SkeletonLine width="w-3/4" height="h-4" />
              <SkeletonLine width="w-1/2" height="h-4" />
            </div>
          </div>
        </div>
      </SkeletonCard>

      {/* Koordinat Lokasi Skeleton */}
      <SkeletonCard>
        <div className="flex items-center mb-4">
          <div className="w-2 h-6 bg-gray-200 rounded-full mr-3 animate-pulse"></div>
          <SkeletonLine width="w-1/3" height="h-6" />
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <SkeletonLine width="w-1/3" height="h-4" />
              <div className="mt-2">
                <SkeletonLine width="w-2/3" height="h-6" />
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <SkeletonLine width="w-1/3" height="h-4" />
              <div className="mt-2">
                <SkeletonLine width="w-2/3" height="h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <SkeletonLine width="w-1/2" height="h-4" />
            <div className="mt-2">
              <SkeletonLine width="w-3/4" height="h-4" />
            </div>
            <div className="mt-2">
              <SkeletonLine width="w-1/3" height="h-4" />
            </div>
          </div>
        </div>
      </SkeletonCard>
    </div>

    {/* Projects Section Skeleton */}
    <SkeletonCard>
      <div className="flex items-center mb-4">
        <div className="w-2 h-6 bg-gray-200 rounded-full mr-3 animate-pulse"></div>
        <SkeletonLine width="w-1/4" height="h-6" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-gray-100 p-4 rounded-lg border border-gray-200">
            <SkeletonLine width="w-3/4" height="h-5" />
            <div className="mt-2 space-y-2">
              <SkeletonLine width="w-full" height="h-4" />
              <SkeletonLine width="w-2/3" height="h-4" />
            </div>
            <div className="mt-3">
              <SkeletonBox width="w-20" height="h-6" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonCard>
  </div>
);

const DetailAgriculturalLand = () => {
  const { id } = useParams();
  const [landData, setLandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLandDetail = async () => {
      try {
        setLoading(true);
        const response = await getMyFarms();
        const land = response.data.find(farm => farm.id === id);
        
        if (land) {
          setLandData(land);
        } else {
          setError('Lahan tidak ditemukan');
        }
      } catch (err) {
        setError('Gagal memuat data lahan');
        console.error('Error fetching land detail:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLandDetail();
    }
  }, [id]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !landData) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-danger/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-main_text mb-2">
            {error || 'Data Tidak Ditemukan'}
          </h3>
          <p className="text-main_text/60">
            Lahan yang Anda cari tidak dapat ditemukan atau terjadi kesalahan saat memuat data.
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (isActive) => {
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
        isActive 
          ? 'bg-done/20 text-done' 
          : 'bg-danger/20 text-danger'
      }`}>
        {isActive ? 'Aktif' : 'Tidak Aktif'}
      </span>
    );
  };

  return (
    <div className="p-2 max-w-7xl">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-2">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div className="flex-1 flex items-center gap-4">
            <Link to="/dashboard/agricultural-land">
                <MdArrowBack size={24} className="inline mr-2 text-main_text hover:text-main cursor-pointer" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-main_text mb-2">
              {landData.name}
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:items-center">
            {getStatusBadge(landData.is_active)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-2">
        {/* Informasi Lahan */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-main_text mb-4 flex items-center">
            <div className="w-2 h-6 bg-main rounded-full mr-3"></div>
            Informasi Lahan
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-dashboard/50 p-4 rounded-lg">
                <p className="text-sm text-main_text/70 mb-1">Luas Area</p>
                <p className="text-lg font-semibold text-main_text">
                  {landData.area_size} Hektar
                </p>
              </div>
              <div className="bg-dashboard/50 p-4 rounded-lg">
                <p className="text-sm text-main_text/70 mb-1">Jenis Tanaman</p>
                <p className="text-lg font-semibold text-main_text">
                  {landData.crop_type}
                </p>
              </div>
            </div>
            
            <div className="bg-dashboard/50 p-4 rounded-lg">
              <p className="text-sm text-main_text/70 mb-1">Sistem Irigasi</p>
              <p className="text-base font-medium text-main_text">
                {landData.irrigation_type}
              </p>
            </div>
            
            <div className="bg-dashboard/50 p-4 rounded-lg">
              <p className="text-sm text-main_text/70 mb-1">Deskripsi</p>
              <p className="text-base text-main_text leading-relaxed">
                {landData.description}
              </p>
            </div>
          </div>
        </div>

        {/* Lokasi */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-main_text mb-4 flex items-center">
            <div className="w-2 h-6 bg-secondary rounded-full mr-3"></div>
            Koordinat Lokasi
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-dashboard/50 p-4 rounded-lg">
                <p className="text-sm text-main_text/70 mb-1">Latitude</p>
                <p className="text-lg font-mono font-semibold text-main_text">
                  {landData.latitude}
                </p>
              </div>
              <div className="bg-dashboard/50 p-4 rounded-lg">
                <p className="text-sm text-main_text/70 mb-1">Longitude</p>
                <p className="text-lg font-mono font-semibold text-main_text">
                  {landData.longitude}
                </p>
              </div>
            </div>
            
            <div className="bg-dashboard/50 p-4 rounded-lg">
              <p className="text-sm text-main_text/70 mb-1">Koordinat Lengkap</p>
              <p className="text-base font-mono text-main_text">
                {landData.latitude}, {landData.longitude}
              </p>
              {/* <button className="mt-2 text-main hover:text-main/80 text-sm font-medium transition-colors">
                Lihat di Maps →
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-main_text mb-4 flex items-center">
          <div className="w-2 h-6 bg-main rounded-full mr-3"></div>
          Proyek Terkait
        </h2>
        
        {landData.Projects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Projects will be mapped here when data is available */}
            {landData.Projects.map((project, index) => (
              <div key={index} className="bg-dashboard/50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-main_text mb-2">{project.name}</h3>
                <p className="text-sm text-main_text/70 mb-2">{project.description}</p>
                <span className="inline-flex px-2 py-1 bg-main/20 text-main text-xs rounded-full">
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-dashboard rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-main_text/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-main_text mb-2">
              Belum Ada Proyek
            </h3>
            <p className="text-main_text/60 mb-4">
              Lahan ini belum memiliki proyek yang terkait
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-main text-white rounded-lg hover:bg-main/90 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Proyek
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailAgriculturalLand;