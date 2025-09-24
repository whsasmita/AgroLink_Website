import ProjectCard from "../../compound/card/ProjectCard";

const ProjectList = ({
  projects,
  loading,
  error,
  onApplyProject,
  onViewDetails,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-pulse"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-6 bg-gray-300 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2 w-1/4"></div>
              </div>
              <div className="h-5 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-28"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
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
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Waduh! Sedang terjadi masalah
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          className="px-4 py-2 text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity duration-200"
          style={{ backgroundColor: "#B53939" }}
          onClick={() => window.location.reload()}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
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
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Tidak Ada Proyek Tersedia
        </h3>
        <p className="text-gray-500 mb-4">
          Kami tidak dapat menemukan proyek saat ini. Silakan coba lagi nanti
          atau periksa kembali segera.
        </p>
        <button
          className="px-6 py-2 text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity duration-200"
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
            {projects.length} proyek{projects.length !== 1 ? "" : ""} ditemukan
            {urgentProjects > 0 && (
              <span className="ml-2 text-red-600 font-medium">
                ({urgentProjects} urgent)
              </span>
            )}
          </p>
        </div>

        {/* Filter/Sort Options */}
        <div className="flex space-x-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{ focusRingColor: "#39B54A" }}
          >
            <option value="newest">Terbaru</option>
            <option value="urgent">Urgent</option>
            <option value="payment">Gaji Tertinggi</option>
            <option value="start_date">Mulai Terdekat</option>
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{ focusRingColor: "#39B54A" }}
          >
            <option value="all">Semua Jenis</option>
            <option value="harvesting">Panen</option>
            <option value="planting">Tanam</option>
            <option value="maintenance">Perawatan</option>
            <option value="processing">Pengolahan</option>
            <option value="transportation">Transportasi</option>
          </select>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
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
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors duration-200">
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
          <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors duration-200">
            Berikutnya
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectList;