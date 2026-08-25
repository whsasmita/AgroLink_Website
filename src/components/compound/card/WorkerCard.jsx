import { useState } from "react";
import AuthModal from "../modal/AuthModal";
import DirectOfferModal from "../modal/DirrectOfferModal"; // Import modal baru
import { useNavigate } from "react-router-dom";
import { directOffer } from "../../../services/applicationService"; // Import service

const WorkerCard = ({ worker }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDirectOfferModalOpen, setIsDirectOfferModalOpen] = useState(false);
  const navigate = useNavigate();

  const {
    user_id: id,
    name,
    profile_picture,
    skills,
    hourly_rate,
    daily_rate,
    address,
    availability_schedule,
    rating,
    total_jobs_completed,
  } = worker;

  // Parse JSON strings with error handling
  const parseJSON = (jsonString, fallback = {}) => {
    try {
      if (!jsonString || jsonString === "null" || jsonString === "undefined") {
        return fallback;
      }
      const parsed = JSON.parse(jsonString);
      return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return fallback;
    }
  };

  const workerSkills = (() => {
    const parsed = parseJSON(skills, []);
    return Array.isArray(parsed) ? parsed : [];
  })();

  const schedule = (() => {
    const parsed = parseJSON(availability_schedule, {});
    return parsed && typeof parsed === "object" ? parsed : {};
  })();

  // Format pricing
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const skillLabels = {
    agriculture: "Pertanian",
    livestock: "Peternakan",
    construction: "Tukang Bangunan",
    fishery: "Perikanan",
    carpentry: "Tukang Kayu",
    electrician: "Tukang Listrik",
    plumbing: "Tukang Pipa/Ledeng",
    gardening: "Tukang Kebun",
  };

  // Get available days
  const getAvailableDays = () => {
    const days = {
      monday: "Sen",
      tuesday: "Sel",
      wednesday: "Rab",
      thursday: "Kam",
      friday: "Jum",
      saturday: "Sab",
      sunday: "Min",
    };

    if (!schedule || typeof schedule !== "object" || schedule === null) {
      return [];
    }

    try {
      const scheduleKeys = Object.keys(schedule);
      if (!scheduleKeys || scheduleKeys.length === 0) {
        return [];
      }

      const availableDays = scheduleKeys
        .map((day) => days[day] || day)
        .filter(Boolean);
      return Array.isArray(availableDays) ? availableDays : [];
    } catch (error) {
      console.error("Error in getAvailableDays:", error);
      return [];
    }
  };

  // Navigate to detail page
  const handleProfileClick = () => {
    navigate(`/worker/${id}`);
  };

  // Function untuk handle klik rekrut worker
  const handleRecruitWorker = () => {
    const isUserLoggedIn = localStorage.getItem("token");

    if (isUserLoggedIn) {
      // Jika sudah login, buka modal direct offer
      setIsDirectOfferModalOpen(true);
    } else {
      // Jika belum login, tampilkan modal auth
      setIsAuthModalOpen(true);
    }
  };

  // Function untuk submit direct offer
  const handleSubmitDirectOffer = async (formData) => {
    try {
      // Kirim data ke API
      const response = await directOffer(id, formData);

      // Tampilkan notifikasi sukses (Anda bisa gunakan toast library)
      alert("Penawaran berhasil dikirim!");
      console.log("Direct offer sent:", response);

      // Opsional: refresh data atau navigasi
      // navigate('/my-offers');
    } catch (error) {
      console.error("Error sending direct offer:", error);
      throw error; // Re-throw untuk ditangani oleh modal
    }
  };

  return (
    <>
      <div className="w-full p-4 sm:p-5 transition-all duration-300 bg-white border border-gray-100/90 rounded-2xl shadow-sm hover:shadow-lg flex flex-col justify-between h-full">
        {/* Header Section */}
        <div>
          <div className="flex items-start mb-3 space-x-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 overflow-hidden border-2 border-green-100 rounded-full shadow-sm">
              {profile_picture ? (
                <img
                  src={profile_picture}
                  alt={`${name} profile`}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div
                  className="flex items-center justify-center w-full h-full text-lg font-bold text-white"
                  style={{ backgroundColor: "#39B54A" }}
                >
                  {name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="mb-1 text-base font-bold text-gray-800 line-clamp-1">
              {name || "Nama tidak tersedia"}
            </h3>
            
            {/* Rating & Jobs Completed info */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {Number(rating) > 0 ? (
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
                  <span className="text-yellow-500 text-xs">⭐</span>
                  <span className="text-xs font-bold text-gray-800">{Number(rating).toFixed(1)}</span>
                  <span className="text-[11px] text-gray-500">
                    ({worker.review_count || 0})
                  </span>
                </div>
              ) : (
                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  Pekerja Baru
                </span>
              )}

              {worker.total_jobs_completed !== undefined && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                  {worker.total_jobs_completed} Pekerjaan
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-2.5 mb-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-start">
            <svg
              className="w-3.5 h-3.5 text-gray-400 mr-1.5 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-xs text-gray-600 line-clamp-1">
              {address || "Lokasi mitra pekerja terverifikasi"}
            </span>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-3">
          <h4 className="mb-2 text-xs font-semibold text-gray-700">
            Bidang Keahlian:
          </h4>
          <div className="flex flex-wrap gap-1">
            {Array.isArray(workerSkills) && workerSkills.length > 0 ? (
              workerSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: "rgba(183, 234, 181, 0.7)",
                    color: "#585656",
                  }}
                >
                  {skillLabels[skill] || skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">Tidak ada keahlian</span>
            )}
          </div>
        </div>

        {/* Availability */}
        <div className="mb-3">
          <h4 className="mb-2 text-xs font-semibold text-gray-700">
            Tersedia:
          </h4>
          <div className="flex flex-wrap gap-1">
            {(() => {
              const days = getAvailableDays();
              return Array.isArray(days) && days.length > 0;
            })() ? (
              getAvailableDays().map((day, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded"
                >
                  {day}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">
                Jadwal tidak tersedia
              </span>
            )}
          </div>
          {schedule &&
            typeof schedule === "object" &&
            Object.keys(schedule).length > 0 &&
            Object.entries(schedule)[0] && (
              <div className="mt-1 text-xs text-gray-600">
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 mr-1 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="truncate">
                    {Object.entries(schedule)[0][1]}
                  </span>
                </div>
              </div>
            )}
        </div>

        {/* Pricing Information */}
        <div className="mb-3">
          <h4 className="mb-2 text-xs font-semibold text-gray-700">Tarif:</h4>
          <div className="grid grid-cols-2 gap-1">
            <div className="p-2 text-center rounded bg-gray-50">
              <p className="text-xs text-gray-600">Per Jam</p>
              <p className="text-xs font-semibold text-gray-800">
                {hourly_rate ? formatPrice(hourly_rate) : "Tidak tersedia"}
              </p>
            </div>
            <div className="p-2 text-center rounded bg-gray-50">
              <p className="text-xs text-gray-600">Per Hari</p>
              <p className="text-xs font-semibold text-gray-800">
                {daily_rate ? formatPrice(daily_rate) : "Tidak tersedia"}
              </p>
            </div>
          </div>
        </div>
      </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <button
            onClick={handleRecruitWorker}
            className="flex-1 px-4 py-2.5 text-xs font-semibold text-white transition-all duration-200 rounded-xl bg-main hover:bg-green-600 shadow-sm hover:shadow-md"
          >
            Rekrut Pekerja
          </button>
          <button
            onClick={handleProfileClick}
            className="px-4 py-2.5 text-xs font-semibold text-gray-700 transition-colors duration-200 border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            Lihat Profil
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Direct Offer Modal */}
      <DirectOfferModal
        isOpen={isDirectOfferModalOpen}
        onClose={() => setIsDirectOfferModalOpen(false)}
        worker={worker}
        onSubmit={handleSubmitDirectOffer}
      />
    </>
  );
};

export default WorkerCard;
