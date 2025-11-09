import { useState, useEffect } from "react";
import ProjectCard from "../../compound/card/ProjectCard";

const ProjectList = ({
  projects,
  loading,
  error,
  onApplyProject,
  onViewDetails,
}) => {

  const [sortOrder, setSortOrder] = useState("newest");
  const [projectType, setProjectType] = useState("all");
  
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleTypeChange = (e) => {
    setProjectType(e.target.value);
  };

  const getProcessedProjects = () => {
    if (!projects) return [];

    let processedData = [...projects]; 

    if (projectType !== "all") {
      processedData = processedData.filter((project) =>
        (project.title || '').toLowerCase().includes(projectType)
      );
    }

    processedData.sort((a, b) => {
      try {
        switch (sortOrder) {
          case "urgent":
            const a_start = new Date(a.start_date);
            const b_start = new Date(b.start_date);
            const today = new Date();
            const a_diff = Math.ceil((a_start - today) / (1000 * 60 * 60 * 24));
            const b_diff = Math.ceil((b_start - today) / (1000 * 60 * 60 * 24));

            const isAUrgent = a_diff >= 0 && a_diff <= 3;
            const isBUrgent = b_diff >= 0 && b_diff <= 3;

            if (isAUrgent && !isBUrgent) return -1;
            if (!isAUrgent && isBUrgent) return 1;
            return a_start - b_start;
            
          case "payment":
            return (b.payment_rate || 0) - (a.payment_rate || 0);
            
          case "start_date":
            return new Date(a.start_date) - new Date(b.start_date);
            
          case "newest":
          default:
            return new Date(b.created_at) - new Date(a.created_at); 
        }
      } catch (e) {
        console.error("Error sorting projects:", e);
        return 0;
      }
    });

    return processedData;
  };

  const processedProjects = getProcessedProjects();

  // Skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="p-6 bg-white border border-gray-200 rounded-lg shadow-md animate-pulse"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="w-3/4 h-6 mb-3 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-4 mb-2 bg-gray-300 rounded"></div>
              </div>
              <div className="w-16 h-5 bg-gray-300 rounded"></div>
            </div>
            <div className="mb-4 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <div className="w-32 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <div className="w-24 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-28"></div>
              </div>
            </div>
            <div className="mb-4 space-y-2">
              <div className="w-full h-4 bg-gray-300 rounded"></div>
              <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <div className="flex-1 h-8 bg-gray-300 rounded"></div>
              <div className="flex-1 h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }


  // Error State
  if (error) {
    return (
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
        <h3 className="mb-2 text-lg font-semibold text-red-800">
          Waduh! Sedang terjadi masalah
        </h3>
        <p className="mb-4 text-red-600">{error}</p>
        <button
          className="px-4 py-2 text-sm font-medium text-white transition-opacity duration-200 rounded-md hover:opacity-90"
          style={{ backgroundColor: "#B53939" }}
          onClick={() => window.location.reload()}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!processedProjects || processedProjects.length === 0) {
    return (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-700">
          {projects.length === 0 ? "Tidak Ada Proyek Tersedia" : "Tidak Ada Proyek Sesuai Filter"}
        </h3>
        <p className="mb-4 text-gray-500">
          {projects.length === 0 
            ? "Kami tidak dapat menemukan proyek saat ini. Silakan coba lagi nanti." 
            : "Coba ubah atau reset filter Anda untuk melihat lebih banyak proyek."
          }
        </p>
        <button
          className="px-6 py-2 text-sm font-medium text-white transition-opacity duration-200 rounded-md hover:opacity-90"
          style={{ backgroundColor: "#39B54A" }}
          onClick={() => window.location.reload()}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // Count urgent projects
  const urgentProjects = projects.filter((project) => {
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

  return (
    <div className="space-y-6">
      {/* List Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#585656" }}>
            Proyek Tersedia
          </h2>
          <p className="text-sm" style={{ color: "#585656" }}>
            {processedProjects.length} proyek ditemukan
            {urgentProjects > 0 && (
              <span className="ml-2 font-medium text-red-600">
                ({urgentProjects} urgent)
              </span>
            )}
          </p>
        </div>

        {/* Filter/Sort Options */}
        <div className="flex hidden space-x-2 lg:block">
          <select
            value={sortOrder}
            onChange={handleSortChange}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{ focusRingColor: "#39B54A" }}
          >
            <option value="newest">Terbaru</option>
            <option value="urgent">Urgent</option>
            <option value="payment">Gaji Tertinggi</option>
            <option value="start_date">Mulai Terdekat</option>
          </select>

          <select
            value={projectType}
            onChange={handleTypeChange}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{ focusRingColor: "#39B54A" }}
          >
            <option value="all">Semua Jenis</option>
            <option value="panen">Panen</option>
            <option value="tanam">Tanam</option>
            <option value="perawatan">Perawatan</option>
            <option value="pembangunan">Pembangunan</option>
            <option value="pengolahan">Pengolahan</option>
            <option value="transportasi">Transportasi</option>
          </select>
        </div>
      </div>
      
      <div className="flex space-x-2 lg:hidden">
        <select
            value={sortOrder}
            onChange={handleSortChange}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{ focusRingColor: "#39B54A" }}
          >
            <option value="newest">Terbaru</option>
            <option value="urgent">Urgent</option>
            <option value="payment">Gaji Tertinggi</option>
            <option value="start_date">Mulai Terdekat</option>
          </select>

          <select
            value={projectType}
            onChange={handleTypeChange}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{ focusRingColor: "#39B54A" }}
          >
            <option value="all">Semua Jenis</option>
            <option value="panen">Panen</option>
            <option value="tanam">Tanam</option>
            <option value="perawatan">Perawatan</option>
            <option value="pengolahan">Pengolahan</option>
            <option value="transportasi">Transportasi</option>
          </select>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {processedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onApplyProject={onApplyProject}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* Pagination */}
      {projects.length >= 12 && (
        <div className="flex items-center justify-center mt-8 space-x-2">
          <button className="px-3 py-2 text-sm transition-colors duration-200 border border-gray-300 rounded-md hover:bg-gray-50">
            Sebelumnya
          </button>
          <div className="flex space-x-1">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                  page === 1
                    ? "text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
                style={page === 1 ? { backgroundColor: "#39B54A" } : {}}
              >
                {page}
              </button>
            ))}
          </div>
          <button className="px-3 py-2 text-sm transition-colors duration-200 border border-gray-300 rounded-md hover:bg-gray-50">
            Berikutnya
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectList;