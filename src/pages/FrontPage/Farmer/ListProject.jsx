import { useState, useEffect } from "react";
import ProjectList from "../../../components/fragments/list/ProjectList";
import { getProjects } from "../../../services/projectService";
import { useNavigate } from "react-router-dom"; 

const ListProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [originalProjects, setOriginalProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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
    console.log("Applied to:", project.title);
  };

  const handleViewDetails = (project) => {
    console.log("Navigating to details for project:", project?.id);
    if (project && project.id) {
      navigate(`/projects/view/${project.id}`);
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
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl px-4 py-8 mx-auto">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-main text-xs font-semibold rounded-full mb-2 border border-green-200/50">
                <span>🌾 Ekosistem Proyek AgroLink</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Temukan Lowongan Proyek Pertanian
              </h1>
              <p className="mt-1 text-sm sm:text-base text-gray-500">
                Pilih dari berbagai proyek pertanian yang tersedia dan mulai bekerja dengan aman.
              </p>
            </div>
            <div className="flex-shrink-0 lg:w-96">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <svg
                    className="w-4 h-4"
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
                  placeholder="Cari judul, lokasi, atau jenis pekerjaan..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full py-2.5 pl-10 pr-4 text-sm placeholder-gray-400 bg-gray-50/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl px-4 py-8 mx-auto">
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