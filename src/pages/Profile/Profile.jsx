import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import {
  getProfile,
  getPhoto,
  uploadProfilePhoto,
} from "../../services/profileService";

const DetailItem = ({ label, children }) => (
  <div>
    <span className="block text-sm font-medium text-gray-500">{label}:</span>
    <div className="mt-1 text-base text-gray-800">{children}</div>
  </div>
);

// Skeleton Components
const SkeletonLine = ({ width = "w-full", height = "h-4" }) => (
  <div
    className={`bg-gray-200 rounded-md animate-[pulse_1.5s_cubic-bezier(0.4,_0,_0.6,_1)_infinite] ${width} ${height}`}
  ></div>
);

const SkeletonBox = ({ width = "w-full", height = "h-4" }) => (
  <div
    className={`bg-gray-200 rounded-lg animate-[pulse_1.5s_cubic-bezier(0.4,_0,_0.6,_1)_infinite] ${width} ${height}`}
  ></div>
);

const SkeletonDetailItem = ({ labelWidth = "w-20" }) => (
  <div className="space-y-1">
    <SkeletonLine width={labelWidth} height="h-3" />
    <SkeletonLine width="w-40" height="h-5" />
  </div>
);

const SkeletonList = ({ items = 3 }) => (
  <ul className="mt-1 space-y-1 list-disc list-inside">
    {[...Array(items)].map((_, index) => (
      <li key={index} className="flex items-center gap-2">
        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
        <SkeletonLine width="w-48" height="h-4" />
      </li>
    ))}
  </ul>
);

const ProfileSkeleton = () => (
  <>
    <div className="container p-4 mx-auto md:p-6 lg:p-8">
      <SkeletonLine width="w-48" height="h-8" />

      <div className="flex flex-col gap-8 mt-6 lg:flex-row">
        {/* Profile Header Skeleton */}
        <div className="flex flex-col items-center flex-shrink-0 p-8 space-y-4 bg-white border border-gray-200 lg:w-1/3 rounded-xl">
          <div className="w-36 h-36 bg-gray-200 rounded-full animate-[pulse_1.5s_cubic-bezier(0.4,_0,_0.6,_1)_infinite]"></div>
          <SkeletonLine width="w-48" height="h-7" />
          <div className="flex items-center gap-3">
            <SkeletonLine width="w-16" height="h-5" />
            <SkeletonBox width="w-20" height="h-6" />
          </div>
        </div>

        {/* Business Information Skeleton */}
        <div className="flex-grow p-8 bg-white border border-gray-200 lg:w-2/3 rounded-xl">
          <SkeletonLine width="w-1/3" height="h-7" />
          <div className="mt-6 space-y-6">
            <SkeletonDetailItem labelWidth="w-20" />
            <SkeletonDetailItem labelWidth="w-24" />
            <SkeletonDetailItem labelWidth="w-28" />

            {/* Skeleton for schedule table */}
            <div className="space-y-2">
              <SkeletonLine width="w-32" height="h-4" />
              <SkeletonBox width="w-full" height="h-40" />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Button Skeleton */}
      <div className="flex justify-end mt-8">
        <SkeletonBox width="w-32" height="h-12" />
      </div>
    </div>
  </>
);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch profile data
        const profileRes = await getProfile();
        setProfile(profileRes.data);

        // Get profile photo URL using getPhoto service
        if (profileRes.data?.profile_picture) {
          const photoRes = await getPhoto(profileRes.data.profile_picture);
          setProfilePhoto(photoRes.data?.url);
        }
      } catch (err) {
        setError("Gagal mengambil data profil.");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const fileInputRef = useState(null);

  const handleEditPhoto = () => {
    if (fileInputRef[0]) {
      fileInputRef[0].click();
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setLoading(true);
        setError("");

        // Upload new profile photo
        await uploadProfilePhoto(file);

        // Refetch profile data after upload
        const profileRes = await getProfile();
        setProfile(profileRes.data);

        // Get updated profile photo URL
        if (profileRes.data?.profile_picture) {
          const photoRes = await getPhoto(profileRes.data.profile_picture);
          setProfilePhoto(photoRes.data?.url);
        }
      } catch (err) {
        console.error("Error uploading photo:", err);
        setError(
          "Gagal upload foto profil: " + (err.message || "Unknown error")
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const renderRoleDetails = () => {
    if (!profile?.role) return null;

    // Helper function to safely parse JSON
    const safeJsonParse = (jsonString, fallback = null) => {
      if (!jsonString) return fallback;
      if (typeof jsonString === "object") return jsonString;
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        console.warn("Failed to parse JSON:", jsonString);
        return fallback;
      }
    };

    const detailsCard = (title, children) => (
      <div className="w-full p-8 bg-white border border-gray-200 shadow-md rounded-xl">
        <h3 className="mb-6 text-2xl font-bold text-main">{title}</h3>
        <div className="space-y-6">{children}</div>
      </div>
    );

    switch (profile.role) {
      case "worker": {
        const details = profile.worker;
        if (!details) return null;

        const skills = safeJsonParse(details.skills, []);
        const schedule = safeJsonParse(details.availability_schedule, {});

        return detailsCard(
          "Informasi Bisnis",
          <>
            {/* KEAHLIAN */}
            <DetailItem label="Keahlian">
              {Array.isArray(skills) && skills.length > 0
                ? skills.join(", ")
                : "Belum diatur"}
            </DetailItem>

            {/* TARIF */}
            <DetailItem label="Tarif per Jam">
              {formatCurrency(details.hourly_rate)}
            </DetailItem>
            <DetailItem label="Tarif per Hari">
              {formatCurrency(details.daily_rate)}
            </DetailItem>

            {/* ALAMAT */}
            <DetailItem label="Alamat">
              {details.address || "Belum diatur"}
            </DetailItem>

            {/* Phone Number */}
            <DetailItem label="No. HP">{profile.phone_number}</DetailItem>

            {/* JADWAL */}
            <DetailItem label="Jadwal Ketersediaan">
              {schedule && Object.keys(schedule).length > 0 ? (
                <div className="mt-2 overflow-hidden border border-gray-200 rounded-lg">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs tracking-wider text-gray-600 uppercase border-b bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 font-semibold">
                          Hari
                        </th>
                        <th scope="col" className="px-6 py-3 font-semibold">
                          Waktu
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {Object.entries(schedule).map(([day, time]) => (
                        <tr key={day} className="border-b last:border-0">
                          <td className="px-6 py-4 font-medium text-gray-800 capitalize">
                            {day === "monday"
                              ? "Senin"
                              : day === "tuesday"
                              ? "Selasa"
                              : day === "wednesday"
                              ? "Rabu"
                              : day === "thursday"
                              ? "Kamis"
                              : day === "friday"
                              ? "Jumat"
                              : day === "saturday"
                              ? "Sabtu"
                              : day === "sunday"
                              ? "Minggu"
                              : day}
                          </td>
                          <td className="px-6 py-4 text-gray-600">{time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                "Belum diatur"
              )}
            </DetailItem>

            {/* LOKASI */}
            {/* {details.current_location_lat && details.current_location_lng && (
              <DetailItem label="Lokasi">
                {details.current_location_lat}, {details.current_location_lng}
              </DetailItem>
            )} */}
          </>
        );
      }

      case "farmer": {
        const details = profile.farmer;
        if (!details) return null;

        return detailsCard(
          "Informasi Bisnis",
          <>
            <DetailItem label="Alamat">
              {details.address || "Belum diatur"}
            </DetailItem>

            {/* Phone Number */}
            <DetailItem label="No. HP">{profile.phone_number}</DetailItem>
            
            <DetailItem label="Info Tambahan">
              {details.additional_info || "Tidak ada"}
            </DetailItem>
          </>
        );
      }

      case "driver": {
        const details = profile.driver;
        if (!details) return null;

        const vehicleTypes = safeJsonParse(details.vehicle_types, []);
        const pricing = safeJsonParse(details.pricing_scheme, {});

        return detailsCard(
          "Informasi Bisnis",
          <>
            <DetailItem label="Alamat Perusahaan">
              {details.company_address || "Belum diatur"}
            </DetailItem>
            {/* Phone Number */}
            <DetailItem label="No. HP">{profile.phone_number}</DetailItem>
            <DetailItem label="Tipe Kendaraan">
              {Array.isArray(vehicleTypes) && vehicleTypes.length > 0
                ? vehicleTypes.join(", ")
                : "Belum diatur"}
            </DetailItem>
            <DetailItem label="Skema Harga">
              {pricing && Object.keys(pricing).length > 0 ? (
                <ul className="mt-1 list-disc list-inside">
                  <li>Biaya Dasar: {formatCurrency(pricing.base_fee)}</li>
                  <li>Biaya per KM: {formatCurrency(pricing.per_km)}</li>
                  <li>
                    Biaya Penanganan Ekstra:{" "}
                    {formatCurrency(pricing.extra_handling)}
                  </li>
                </ul>
              ) : (
                "Belum diatur"
              )}
            </DetailItem>
          </>
        );
      }

      case "general": {

        return detailsCard(
          "Informasi Umum",
          <>
            {/* Phone Number */}
            <DetailItem label="No. HP">{profile.phone_number}</DetailItem>
          </>
        );
        
      }

      default:
        return null;
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-6 border-l-4 border-red-500 rounded-r-lg shadow-md bg-red-50">
          <span className="text-lg font-medium text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <>
      <div className="container p-4 mx-auto md:p-6 lg:p-8">
        <title>Biodata - Agro Link</title>
        <meta name="description" content="Biodata pengguna di Agro Link" />

        <h2 className="mb-6 text-3xl font-bold text-main">Biodata</h2>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Profile Header Section */}
          <div className="flex flex-col items-center flex-shrink-0 w-full p-8 bg-white border border-gray-200 lg:w-1/3 rounded-xl">
            <h2 className="mb-4 text-2xl font-bold text-main">
              {profile.name}
            </h2>

            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <img
                  src={
                    profilePhoto ||
                    profile.profile_picture ||
                    "/default-avatar.png"
                  }
                  alt="Profile"
                  className="object-cover rounded-full shadow-md w-36 h-36 ring-4 ring-green-100"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
                <button
                  onClick={handleEditPhoto}
                  className="absolute bottom-1 right-1 p-2.5 text-white transition duration-200 transform bg-green-600 rounded-full shadow-lg hover:bg-green-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  aria-label="Edit photo"
                >
                  <MdEdit size={20} />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => fileInputRef[1] && fileInputRef[1](el)}
                  onChange={handlePhotoChange}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-base text-gray-500">
                  {profile.role === "farmer"
                    ? "Petani"
                    : profile.role === "worker"
                    ? "Pekerja"
                    : profile.role === "driver"
                    ? "Ekspedisi"
                    : "Umum"}
                </span>
                <span
                  className={profile.is_active ? "text-main" : "text-gray-400"}
                >
                  •
                </span>
                <span
                  className={`text-sm px-4 py-1 font-medium rounded-full transition-colors duration-200 ${
                    profile.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {profile.is_active ? "Aktif" : "Tidak Aktif"}
                </span>
              </div>
            </div>
          </div>

          {/* Role-specific Details */}
          <div className="flex-grow">{renderRoleDetails()}</div>
        </div>

        {/* Edit Button */}
        <div className="flex justify-end mt-8">
          <button
            className="px-6 py-3 font-semibold text-white transition duration-200 transform bg-green-600 rounded-lg shadow-md hover:bg-green-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={() => navigate("/profile/biography/edit")}
          >
            Edit Profil
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
