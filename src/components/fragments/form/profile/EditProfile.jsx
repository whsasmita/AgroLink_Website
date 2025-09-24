import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdEdit, MdSave, MdAdd, MdDelete } from "react-icons/md";
import {
  getProfile,
  editProfile,
  uploadProfilePhoto,
  editInformationDetail,
} from "../../../../services/profileService";

// Skeleton Loading Component
const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-gray-200 rounded-full mr-4"></div>
        <div className="h-8 bg-gray-200 rounded w-32"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Basic Profile Section Skeleton */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>

          {/* Profile Picture Skeleton */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>

          {/* Form Fields Skeleton */}
          <div className="space-y-4">
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            </div>
          </div>
        </div>

        {/* Details Section Skeleton */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>

          {/* Multiple form fields skeleton */}
          <div className="space-y-6">
            <div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-24 bg-gray-200 rounded-lg w-full"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-24 bg-gray-200 rounded-lg w-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

const EditProfileForm = () => {
  const [profile, setProfile] = useState(null);
  const [originalData, setOriginalData] = useState(null); // Store original data
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "", // Added phone_number
    profile_picture: ""
  });
  const [detailsData, setDetailsData] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Get user role from profile or localStorage
  const getUserRole = () => {
    return profile?.role || localStorage.getItem("userRole") || "";
  };

  // Helper function to safely parse JSON
  const safeJsonParse = (jsonString, fallback = null) => {
    if (!jsonString) return fallback;
    if (typeof jsonString === 'object') return jsonString;
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn('Failed to parse JSON:', jsonString);
      return fallback;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getProfile();
        const profileData = res.data;
        setProfile(profileData);
        setOriginalData(profileData); // Store original data

        // Initialize form data with all existing values
        setFormData({
          name: profileData.name || "",
          phone_number: profileData.phone_number || "",
          profile_picture: profileData.profile_picture || ""
        });
        setPhotoPreview(profileData.profile_picture || "");

        // Initialize details data based on role with all existing values preserved
        if (profileData.details) {
          const role = profileData.role;
          const details = profileData.details;

          switch (role) {
            case "farmer":
              setDetailsData({
                address: details.address || "",
                additional_info: details.additional_info || "",
                // Preserve any other existing fields
                ...details
              });
              break;

            case "driver":
              const pricingScheme = safeJsonParse(details.pricing_scheme, {
                base_fee: 0,
                per_km: 0,
                extra_handling: 0
              });
              const vehicleTypes = safeJsonParse(details.vehicle_types, []);

              setDetailsData({
                company_address: details.company_address || "",
                pricing_scheme: {
                  base_fee: pricingScheme.base_fee || 0,
                  per_km: pricingScheme.per_km || 0,
                  extra_handling: pricingScheme.extra_handling || 0,
                  // Preserve any other pricing fields
                  ...pricingScheme
                },
                vehicle_types: vehicleTypes,
                newVehicleType: "",
                // Preserve any other existing fields
                ...details
              });
              break;

            case "worker":
              const skills = safeJsonParse(details.skills, []);
              const availabilitySchedule = safeJsonParse(details.availability_schedule, {});

              setDetailsData({
                skills: skills,
                hourly_rate: details.hourly_rate || 0,
                daily_rate: details.daily_rate || 0,
                address: details.address || "",
                availability_schedule: {
                  monday: "",
                  tuesday: "",
                  wednesday: "",
                  thursday: "",
                  friday: "",
                  saturday: "",
                  sunday: "",
                  ...availabilitySchedule
                },
                newSkill: "",
                current_location_lat: details.current_location_lat || "",
                current_location_lng: details.current_location_lng || "",
                // Preserve any other existing fields
                ...details
              });
              break;

            default:
              // For any other role, preserve all existing details
              setDetailsData({
                ...details
              });
              break;
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Gagal mengambil data profil.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetailsData((prev) => ({
      ...prev,
      [name]: name === 'hourly_rate' || name === 'daily_rate' ? Number(value) || 0 : value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleNestedDetailsChange = (parent, field, value) => {
    setDetailsData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleScheduleChange = (day, value) => {
    setDetailsData((prev) => ({
      ...prev,
      availability_schedule: {
        ...prev.availability_schedule,
        [day]: value
      }
    }));
  };

  const addSkill = () => {
    if (detailsData.newSkill && detailsData.newSkill.trim()) {
      setDetailsData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), prev.newSkill.trim()],
        newSkill: ""
      }));
    }
  };

  const removeSkill = (index) => {
    setDetailsData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((_, i) => i !== index)
    }));
  };

  const addVehicleType = () => {
    if (detailsData.newVehicleType && detailsData.newVehicleType.trim()) {
      setDetailsData((prev) => ({
        ...prev,
        vehicle_types: [...(prev.vehicle_types || []), prev.newVehicleType.trim()],
        newVehicleType: ""
      }));
    }
  };

  const removeVehicleType = (index) => {
    setDetailsData((prev) => ({
      ...prev,
      vehicle_types: (prev.vehicle_types || []).filter((_, i) => i !== index)
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        setError("Silakan pilih file gambar (jpg, png, gif)");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);

      setPhotoFile(file);

      if (error) setError("");
      if (success) setSuccess("");
    }
  };

  const handleEditPhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Helper function to prepare details data for submission
  // Helper function to prepare details data for submission
const prepareDetailsForSubmission = () => {
  const currentDetails = { ...detailsData };

  // Remove temporary fields used for UI
  delete currentDetails.newSkill;
  delete currentDetails.newVehicleType;

  // Deep merge with original details to preserve unchanged fields
  const originalDetails = originalData?.details || {};
  const mergedDetails = { ...originalDetails, ...currentDetails };

  // Handle data formatting based on role
  const role = getUserRole();
  
  if (role === 'worker') {
    // For worker, keep arrays and objects as they are (don't stringify)
    // Only ensure lat/lng are numbers if they exist
    if (mergedDetails.current_location_lat) {
      mergedDetails.current_location_lat = Number(mergedDetails.current_location_lat);
    }
    if (mergedDetails.current_location_lng) {
      mergedDetails.current_location_lng = Number(mergedDetails.current_location_lng);
    }
    // Keep skills as array
    if (Array.isArray(mergedDetails.skills)) {
      // Already an array, keep it as is
    }
    // Keep availability_schedule as object
    if (typeof mergedDetails.availability_schedule === 'object') {
      // Already an object, keep it as is
    }
  } else if (role === 'driver') {
    // For driver, keep arrays and objects as they are (don't stringify)
    // Keep pricing_scheme as object with proper number types
    if (typeof mergedDetails.pricing_scheme === 'object') {
      mergedDetails.pricing_scheme = {
        base_fee: Number(mergedDetails.pricing_scheme.base_fee) || 0,
        per_km: Number(mergedDetails.pricing_scheme.per_km) || 0,
        extra_handling: Number(mergedDetails.pricing_scheme.extra_handling) || 0,
      };
    }
    // Keep vehicle_types as array
    if (Array.isArray(mergedDetails.vehicle_types)) {
      // Already an array, keep it as is
    }
  }
  // For farmer, no special handling needed - just keep the fields as they are

  return mergedDetails;
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Nama tidak boleh kosong.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Prepare profile data - only include changed fields, preserve others
      const profileDataToSubmit = {
        name: formData.name.trim(),
        phone_number: formData.phone_number.trim()
      };

      await editProfile(profileDataToSubmit);

      // Upload photo if changed
      if (photoFile) {
        await uploadProfilePhoto(photoFile);
      }

      // Update details based on role - preserve all existing data
      const role = getUserRole();
      if (role && Object.keys(detailsData).length > 0) {
        const detailsToSubmit = prepareDetailsForSubmission();
        await editInformationDetail(detailsToSubmit, role);
      }

      setSuccess("Profil berhasil diperbarui!");

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || err.message || "Gagal memperbarui profil.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  const renderDetailsForm = () => {
    const role = getUserRole();

    switch (role) {
      case "farmer":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-main_text mb-2">
                Alamat
              </label>
              <textarea
                name="address"
                value={detailsData.address || ""}
                onChange={handleDetailsChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                placeholder="Masukkan alamat lengkap"
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-main_text mb-2">
                Informasi Tambahan
              </label>
              <textarea
                name="additional_info"
                value={detailsData.additional_info || ""}
                onChange={handleDetailsChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                placeholder="Informasi tambahan tentang usaha tani Anda"
                disabled={saving}
              />
            </div>
          </>
        );

      case "driver":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-main_text mb-2">
                Alamat Perusahaan
              </label>
              <textarea
                name="company_address"
                value={detailsData.company_address || ""}
                onChange={handleDetailsChange}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                placeholder="Masukkan alamat perusahaan"
                disabled={saving}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-main_text mb-2">
                  Tarif Dasar (Rp)
                </label>
                <input
                  type="number"
                  value={detailsData.pricing_scheme?.base_fee || 0}
                  onChange={(e) => handleNestedDetailsChange('pricing_scheme', 'base_fee', Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                  placeholder="50000"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-main_text mb-2">
                  Per KM (Rp)
                </label>
                <input
                  type="number"
                  value={detailsData.pricing_scheme?.per_km || 0}
                  onChange={(e) => handleNestedDetailsChange('pricing_scheme', 'per_km', Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                  placeholder="2500"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-main_text mb-2">
                  Biaya Tambahan (Rp)
                </label>
                <input
                  type="number"
                  value={detailsData.pricing_scheme?.extra_handling || 0}
                  onChange={(e) => handleNestedDetailsChange('pricing_scheme', 'extra_handling', Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                  placeholder="15000"
                  disabled={saving}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-main_text mb-2">
                Jenis Kendaraan
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={detailsData.newVehicleType || ""}
                  onChange={(e) => setDetailsData(prev => ({ ...prev, newVehicleType: e.target.value }))}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                  placeholder="Tambah jenis kendaraan"
                  disabled={saving}
                />
                <button
                  type="button"
                  onClick={addVehicleType}
                  className="px-4 py-3 bg-main text-white rounded-lg hover:bg-green-600 transition-colors"
                  disabled={saving}
                >
                  <MdAdd size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {(detailsData.vehicle_types || []).map((vehicle, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-main_text">{vehicle}</span>
                    <button
                      type="button"
                      onClick={() => removeVehicleType(index)}
                      className="text-danger hover:text-red-700 transition-colors"
                      disabled={saving}
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case "worker":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-main_text mb-2">
                Keahlian
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={detailsData.newSkill || ""}
                  onChange={(e) => setDetailsData(prev => ({ ...prev, newSkill: e.target.value }))}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                  placeholder="Tambah keahlian"
                  disabled={saving}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-3 bg-main text-white rounded-lg hover:bg-green-600 transition-colors"
                  disabled={saving}
                >
                  <MdAdd size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {(detailsData.skills || []).map((skill, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-main_text">{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-danger hover:text-red-700 transition-colors"
                      disabled={saving}
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-main_text mb-2">
                  Tarif per Jam (Rp)
                </label>
                <input
                  type="number"
                  name="hourly_rate"
                  value={detailsData.hourly_rate || 0}
                  onChange={handleDetailsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                  placeholder="25000"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-main_text mb-2">
                  Tarif per Hari (Rp)
                </label>
                <input
                  type="number"
                  name="daily_rate"
                  value={detailsData.daily_rate || 0}
                  onChange={handleDetailsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                  placeholder="150000"
                  disabled={saving}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-main_text mb-2">
                Alamat
              </label>
              <textarea
                name="address"
                value={detailsData.address || ""}
                onChange={handleDetailsChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                placeholder="Masukkan alamat lengkap"
                disabled={saving}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-main_text mb-2">
                  Latitude
                </label>
                <input
                  type="text"
                  name="current_location_lat"
                  value={detailsData.current_location_lat || ""}
                  onChange={handleDetailsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                  placeholder="Masukkan latitude"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-main_text mb-2">
                  Longitude
                </label>
                <input
                  type="text"
                  name="current_location_lng"
                  value={detailsData.current_location_lng || ""}
                  onChange={handleDetailsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                  placeholder="Masukkan longitude"
                  disabled={saving}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-main_text mb-2">
                Jadwal Ketersediaan
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                  <div key={day}>
                    <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                      {day === 'monday' ? 'Senin' :
                        day === 'tuesday' ? 'Selasa' :
                          day === 'wednesday' ? 'Rabu' :
                            day === 'thursday' ? 'Kamis' :
                              day === 'friday' ? 'Jumat' :
                                day === 'saturday' ? 'Sabtu' : 'Minggu'}
                    </label>
                    <input
                      type="text"
                      value={detailsData.availability_schedule?.[day] || ""}
                      onChange={(e) => handleScheduleChange(day, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors text-sm"
                      placeholder="08:00-16:00"
                      disabled={saving}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <SkeletonLoader />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Gagal memuat data profil</p>
          <button
            onClick={() => navigate("/profile")}
            className="text-main hover:text-green-700"
          >
            Kembali ke Profil
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center mb-6">
        <button
          onClick={handleCancel}
          className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MdArrowBack size={24} />
        </button>
        <h2 className="text-2xl font-bold text-main">Edit Profil</h2>
      </div>

      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <span className="text-green-700 font-medium">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Profile Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-main mb-6">Informasi Umum</h3>

            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <img
                  src={photoPreview || "/placeholder-avatar.png"}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-full border-4 border-main"
                  onError={(e) => {
                    e.target.src = "/placeholder-avatar.png";
                  }}
                />
                <button
                  type="button"
                  onClick={handleEditPhoto}
                  className="absolute bottom-0 right-0 bg-main text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  <MdEdit size={16} />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handlePhotoChange}
                />
              </div>
              <p className="text-sm text-gray-600">
                {photoFile
                  ? photoFile.name
                  : "Klik ikon pensil untuk mengganti foto"}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-main_text mb-2"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                  placeholder="Masukkan nama lengkap"
                  disabled={saving}
                />
              </div>

              <div>
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nomor HP
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                  placeholder="Masukkan nomor HP"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          {/* Details Section based on role */}
          {getUserRole() && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-main mb-6">
                Informasi {getUserRole() === 'farmer' ? 'Petani' :
                  getUserRole() === 'driver' ? 'Ekspedisi' :
                    getUserRole() === 'worker' ? 'Pekerja' : getUserRole()}
              </h3>

              <div className="space-y-6">
                {renderDetailsForm()}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              disabled={saving}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-main hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <MdSave size={20} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfileForm;