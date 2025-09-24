import { useState, useEffect } from "react";
import ProjectList from "../../../components/fragments/list/ProjectList";
import { getProjects } from "../../../services/projectService";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ListProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [originalProjects, setOriginalProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Inisialisasi hook navigate

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const responseData = await getProjects();
        let projectsData = [];
        if (responseData?.data?.data && Array.isArray(responseData.data.data)) {
          projectsData = responseData.data.data;
        } else if (responseData?.data && Array.isArray(responseData.data)) {
          projectsData = responseData.data;
        } else if (Array.isArray(responseData)) {
          projectsData = responseData;
        }
        setProjects(projectsData);
        setOriginalProjects(projectsData);
      } catch (err) {
        setError("Gagal memuat data proyek. Silakan coba lagi.");
        setProjects([]);
        setOriginalProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleApplyProject = (project) => {
    // Callback dari ProjectCard setelah berhasil apply
    console.log("Applied to:", project.title);
    // Tambahkan logika lain, misal:
    // Tampilkan notifikasi "Berhasil melamar"
    // Refresh daftar proyek jika diperlukan
  };

 const handleViewDetails = (project) => {
  console.log("Navigating to details for project:", project?.id);
  if (project && project.id) {
    navigate(`/projects/${project.id}`);
  }
};

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setProjects(originalProjects);
    } else {
      if (Array.isArray(originalProjects)) {
        const filteredProjects = originalProjects.filter(
          (project) =>
            project?.title?.toLowerCase().includes(query.toLowerCase()) ||
            project?.description?.toLowerCase().includes(query.toLowerCase()) ||
            project?.location?.toLowerCase().includes(query.toLowerCase()) ||
            project?.project_type
              ?.toLowerCase()
              .includes(query.toLowerCase()) ||
            (Array.isArray(project?.required_skills) &&
              project.required_skills.some((skill) =>
                skill?.toLowerCase().includes(query.toLowerCase())
              ))
        );
        setProjects(filteredProjects);
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F4F4F4" }}>
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "#585656" }}>
                Temukan Proyek Anda
              </h1>
              <p className="text-gray-600 mt-2">
                Pilih dari berbagai proyek pertanian yang tersedia dan mulai
                bekerja hari ini
              </p>
            </div>
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
                    focusRingColor: "#39B54A",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <ProjectList
          projects={projects}
          loading={loading}
          error={error}
          onApplyProject={handleApplyProject}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
};

export default ListProject;