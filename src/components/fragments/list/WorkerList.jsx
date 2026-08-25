import { useState } from "react";
import WorkerCard from "../../compound/card/WorkerCard";
import { Users, Layers, RotateCcw } from "lucide-react";

const WorkerList = ({ workers, loading, error, onHireWorker, onViewProfile }) => {
  const [sortOrder, setSortOrder] = useState("experience"); // 'experience', 'rating', 'daily_rate', 'hourly_rate'
  const [skillFilter, setSkillFilter] = useState("all");

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleSkillChange = (e) => {
    setSkillFilter(e.target.value);
  };

  const getProcessedWorkers = () => {
    if (!workers) return [];

    let processedData = [...workers];

    if (skillFilter !== "all" && skillFilter !== "") {
      processedData = processedData.filter((worker) => {
        let skillsArray = [];
        try {
          if (typeof worker.skills === "string") {
            const parsed = JSON.parse(worker.skills);
            skillsArray = Array.isArray(parsed) ? parsed : [worker.skills];
          } else if (Array.isArray(worker.skills)) {
            skillsArray = worker.skills;
          }
        } catch {
          skillsArray = [worker.skills].filter(Boolean);
        }

        const workerSkills = skillsArray.map((skill) => (skill || "").toLowerCase());
        const filterKey = skillFilter.toLowerCase();
        return workerSkills.some((s) => s.includes(filterKey) || filterKey.includes(s));
      });
    }

    processedData.sort((a, b) => {
      try {
        switch (sortOrder) {
          case "experience":
            return (b.total_jobs_completed || 0) - (a.total_jobs_completed || 0);
          case "rating":
            return (Number(b.rating) || 0) - (Number(a.rating) || 0);
          case "daily_rate":
            return (Number(b.daily_rate) || 0) - (Number(a.daily_rate) || 0);
          case "hourly_rate":
            return (Number(b.hourly_rate) || 0) - (Number(a.hourly_rate) || 0);
          default:
            return 0;
        }
      } catch (e) {
        console.error("Error sorting workers:", e);
        return 0;
      }
    });

    return processedData;
  };

  const processedWorkers = getProcessedWorkers();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm animate-pulse space-y-4"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-3 bg-gray-200 rounded"></div>
              <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
            </div>
            <div className="w-full h-9 bg-gray-200 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center border border-red-100 rounded-3xl bg-red-50/50 max-w-lg mx-auto space-y-3">
        <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <RotateCcw size={24} />
        </div>
        <h3 className="text-base font-bold text-red-800">Waduh! Sedang Terjadi Masalah</h3>
        <p className="text-sm text-red-600">{error}</p>
        <button
          className="px-6 py-2.5 text-xs font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm"
          onClick={() => window.location.reload()}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!workers || workers.length === 0) {
    return (
      <div className="p-10 text-center border border-dashed border-gray-200 rounded-3xl bg-white max-w-md mx-auto space-y-3">
        <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
          <Users size={24} />
        </div>
        <h3 className="text-base font-bold text-gray-800">Tidak Ada Pekerja Tersedia</h3>
        <p className="text-sm text-gray-500">
          Belum ada data pekerja yang terdaftar saat ini. Silakan periksa kembali nanti.
        </p>
      </div>
    );
  }

  if (!processedWorkers || processedWorkers.length === 0) {
    return (
      <div className="p-10 text-center border border-dashed border-gray-200 rounded-3xl bg-white max-w-md mx-auto space-y-3">
        <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
          <Layers size={24} />
        </div>
        <h3 className="text-base font-bold text-gray-800">
          Tidak Ada Pekerja Sesuai Filter
        </h3>
        <p className="text-sm text-gray-500">
          Coba ubah atau reset filter keahlian untuk menampilkan lebih banyak pekerja.
        </p>
        <button
          className="px-6 py-2.5 text-xs font-semibold text-white bg-main rounded-xl hover:bg-green-600 shadow-sm"
          onClick={() => {
            setSkillFilter("all");
            setSortOrder("experience");
          }}
        >
          Reset Filter
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter and Count Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Daftar Pekerja Terverifikasi
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Menampilkan <span className="font-semibold text-main">{processedWorkers.length}</span> pekerja siap kerja
          </p>
        </div>

        {/* Filter & Sort selectors */}
        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          <select
            value={skillFilter}
            onChange={handleSkillChange}
            className="flex-1 sm:flex-initial px-3.5 py-2 text-xs sm:text-sm font-semibold bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-main focus:border-transparent cursor-pointer"
          >
            <option value="all">Semua Keterampilan</option>
            <option value="pertanian">🌾 Pertanian</option>
            <option value="peternakan">🐄 Peternakan</option>
            <option value="konstruksi">🔨 Konstruksi / Tukang</option>
          </select>

          <select
            value={sortOrder}
            onChange={handleSortChange}
            className="flex-1 sm:flex-initial px-3.5 py-2 text-xs sm:text-sm font-semibold bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-main focus:border-transparent cursor-pointer"
          >
            <option value="experience">🏆 Pengalaman Terbanyak</option>
            <option value="rating">⭐ Rating Tertinggi</option>
            <option value="daily_rate">💰 Tarif Harian Tertinggi</option>
            <option value="hourly_rate">⏱️ Tarif Per Jam</option>
          </select>
        </div>
      </div>

      {/* Worker Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {processedWorkers.map((worker, index) => (
          <div
            key={worker.user_id || worker.id || index}
            className="transition-all duration-300 hover:-translate-y-1"
          >
            <WorkerCard
              worker={worker}
              onHire={() => onHireWorker && onHireWorker(worker)}
              onViewProfile={() => onViewProfile && onViewProfile(worker)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkerList;