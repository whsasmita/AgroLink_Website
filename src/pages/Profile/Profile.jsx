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
    <span className="font-semibold text-gray-700">{label}:</span>
    <div className="inline-block ml-2 text-gray-900">{children}</div>
  </div>
);

// Skeleton Components
const SkeletonLine = ({ width = "w-full", height = "h-4" }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${width} ${height}`}></div>
);

const SkeletonBox = ({ width = "w-full", height = "h-4" }) => (
  <div
    className={`bg-gray-200 rounded-lg animate-pulse ${width} ${height}`}
  ></div>
);

const SkeletonDetailItem = ({ labelWidth = "w-20" }) => (
  <div>
    <div className="flex items-center gap-2">
      <SkeletonLine width={labelWidth} height="h-4" />
      <span className="text-gray-700">:</span>
      <SkeletonLine width="w-32" height="h-4" />
    </div>
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
    <SkeletonLine width="w-24" height="h-8" />
    <div className="max-w-2xl mx-auto mt-6">
      {/* Profile Header Skeleton */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          {/* Profile Picture Skeleton */}
          <div className="w-32 h-32 bg-gray-200 border-2 border-gray-300 rounded-full animate-pulse"></div>
          {/* Edit Button Skeleton */}
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
        </div>

        {/* Name Skeleton */}
        <SkeletonLine width="w-48" height="h-8" />

        {/* Role and Status Skeleton */}
        <div className="flex items-center gap-3 mt-4 mb-1">
          <SkeletonLine width="w-16" height="h-5" />
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <SkeletonBox width="w-20" height="h-6" />
        </div>
      </div>

      {/* Basic Profile Information Skeleton */}
      <div className="mb-8 space-y-4">
        <SkeletonDetailItem labelWidth="w-16" />
      </div>

      {/* Business Information Skeleton */}
      <div className="mt-8">
        <SkeletonLine width="w-32" height="h-6" />
        <div className="mt-6 space-y-4">
          <SkeletonDetailItem labelWidth="w-20" />
          <SkeletonDetailItem labelWidth="w-24" />
          <SkeletonDetailItem labelWidth="w-28" />
          <SkeletonDetailItem labelWidth="w-16" />

          {/* Special skeleton for complex data like schedules */}
          <div>
            <div className="flex items-center gap-2">
              <SkeletonLine width="w-32" height="h-4" />
              <span className="text-gray-700">:</span>
            </div>
            <div className="mt-2 ml-2">
              <SkeletonList items={3} />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Edit Button Skeleton */}
    <div className="flex justify-end mt-8">
      <SkeletonBox width="w-32" height="h-12" />
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

    switch (profile.role) {
      case "worker": {
        const details = profile.worker;
        if (!details) return null;

        const skills = safeJsonParse(details.skills, []);
        const schedule = safeJsonParse(details.availability_schedule, {});

        return (
          <div className="w-full p-8 m-1 border rounded-lg md:w-2/4">
            <h3 className="mb-6 text-xl font-bold text-main">
              Informasi Bisnis
            </h3>
            <div className="space-y-4">
              <DetailItem label="No. HP">{profile.phone_number}</DetailItem>
              <DetailItem label="Keahlian">
                {Array.isArray(skills) && skills.length > 0
                  ? skills.join(", ")
                  : "Belum diatur"}
              </DetailItem>
              <DetailItem label="Tarif per Jam">
                {formatCurrency(details.hourly_rate)}
              </DetailItem>
              <DetailItem label="Tarif per Hari">
                {formatCurrency(details.daily_rate)}
              </DetailItem>
              <DetailItem label="Alamat">
                {details.address || "Belum diatur"}
              </DetailItem>
              <DetailItem label="Jadwal Ketersediaan">
                {schedule && Object.keys(schedule).length > 0 ? (
                  <ul className="mt-1 list-disc list-inside">
                    {Object.entries(schedule).map(([day, time]) => (
                      <li key={day} className="capitalize">
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
                        : {time}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "Belum diatur"
                )}
              </DetailItem>
              {details.current_location_lat && details.current_location_lng && (
                <DetailItem label="Lokasi">
                  {details.current_location_lat}, {details.current_location_lng}
                </DetailItem>
              )}
            </div>
          </div>
        );
      }

      case "farmer": {
        const details = profile.farmer;
        if (!details) return null;

        return (
          <div className="mt-8">
            <h3 className="mb-6 text-xl font-bold text-main">
              Informasi Bisnis
            </h3>
            <div className="space-y-4">
              <DetailItem label="Alamat">
                {details.address || "Belum diatur"}
              </DetailItem>
              <DetailItem label="Info Tambahan">
                {details.additional_info || "Tidak ada"}
              </DetailItem>
            </div>
          </div>
        );
      }

      case "driver": {
        const details = profile.driver;
        if (!details) return null;

        const vehicleTypes = safeJsonParse(details.vehicle_types, []);
        const pricing = safeJsonParse(details.pricing_scheme, {});

        return (
          <div className="mt-8">
            <h3 className="mb-6 text-xl font-bold text-main">
              Informasi Bisnis
            </h3>
            <div className="space-y-4">
              <DetailItem label="Alamat Perusahaan">
                {details.company_address || "Belum diatur"}
              </DetailItem>
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
            </div>
          </div>
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
      <title>Biodata - Agro Link</title>
      <meta name="description" content="Biodata pengguna di Agro Link" />

      <h2 className="mb-6 text-3xl font-bold text-main">Biodata</h2>

      <div className="flex flex-wrap">
        {/* Profile Header Section */}
        <div className="flex flex-col items-center w-full p-8 m-1 border rounded-lg md:w-2/5">
          <h2 className="mb-2 text-2xl font-bold text-main">{profile.name}</h2>

          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-lg text-gray-600">
                {profile.role === "farmer"
                  ? "Petani"
                  : profile.role === "worker"
                  ? "Pekerja"
                  : "Ekspedisi"}
              </span>
              <span
                className={profile.is_active ? "text-main" : "text-main__text"}
              >
                •
              </span>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  profile.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {profile.is_active ? "Aktif" : "Tidak Aktif"}
              </span>
            </div>
          </div>

          <div className="relative mb-4">
            <img
              src={
                profilePhoto || profile.profile_picture || "/default-avatar.png"
              }
              alt="Profile"
              className="object-cover border-2 rounded-full w-44 h-44 border-main"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
            <button
              onClick={handleEditPhoto}
              className="absolute bottom-0 right-0 p-2 text-white transition-colors duration-200 rounded-full shadow-lg bg-main hover:bg-green-700"
            >
              <MdEdit size={16} />
            </button>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={(el) => fileInputRef[1] && fileInputRef[1](el)}
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        {/* Role-specific Details */}
        {renderRoleDetails()}
        {/* Basic Profile Information */}
        {/* <div className="space-y-4">
          <DetailItem label="No. HP">{profile.phone_number}</DetailItem>
        </div> */}
      </div>

      {/* Edit Button */}
      <div className="flex justify-end mt-8">
        <button
          className="px-8 py-3 font-medium text-white transition-colors duration-200 bg-green-500 rounded-lg hover:bg-green-600"
          onClick={() => navigate("/profile/biography/edit")}
        >
          Edit Profil
        </button>
      </div>
    </>
  );
};

export default ProfilePage;
