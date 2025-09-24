import { useState } from "react";
import { Link } from "react-router-dom";
import { MdDownload, MdAdd, MdSearch, MdWork, MdInbox } from "react-icons/md";

const MyJobListPage = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  
  // Empty jobs array - replace with actual data from your API
  const jobs = [];

  // Filter jobs based on search term
  const filteredJobs = jobs.filter((job) =>
    job.project_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle contract download
  const handleDownloadContract = (jobId) => {
    // Implement contract download logic here
    console.log(`Downloading contract for job ${jobId}`);
    // You can add your contract download API call here
  };

  return (
    <div className="p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row bg-white rounded-lg shadow-sm p-4 justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-main mb-2">
            Daftar Pekerjaan
          </h1>
          <p className="text-main_text text-sm sm:text-base">
            Kelola data pekerjaan Anda
          </p>
        </div>
        <Link
          to="/projects"
          className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-main hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <MdAdd size={20} />
          <span className="sm:inline">Cari Pekerjaan</span>
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-danger p-4 rounded-r-lg">
          <span className="text-danger font-medium text-sm sm:text-base">
            {error}
          </span>
        </div>
      )}

      {/* Search and Contracts */}
      <div className="mb-4 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <MdSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari pekerjaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent text-sm sm:text-base"
            />
          </div>

          {/* Contracts Button */}
          <div className="relative">
            <Link
              to="/dashboard/my-jobs/contracts"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <MdInbox size={20} className="text-gray-600" />
              <span className="text-gray-700">Kontrak</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {filteredJobs.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-4">
              <MdWork size={64} className="text-gray-300 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {jobs.length === 0
                ? "Belum Ada Pekerjaan"
                : "Tidak Ada Data yang Sesuai"}
            </h3>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">
              {jobs.length === 0
                ? "Mulai cari pekerjaan untuk memulai karier Anda."
                : "Coba ubah kriteria pencarian Anda."}
            </p>
            {jobs.length === 0 && (
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-main hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                <MdAdd size={20} />
                Cari Pekerjaan
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base">
                    No
                  </th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base min-w-[200px]">
                    Nama Proyek
                  </th>
                  <th className="text-center px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base min-w-[120px]">
                    Kontrak
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job, index) => (
                  <tr
                    key={job.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-main_text text-sm sm:text-base">
                      {index + 1}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm sm:text-base break-words">
                          {job.project_title}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleDownloadContract(job.id)}
                          className="p-2 text-main hover:bg-green-100 rounded-lg transition-colors"
                          title="Unduh Kontrak"
                        >
                          <MdDownload size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobListPage;