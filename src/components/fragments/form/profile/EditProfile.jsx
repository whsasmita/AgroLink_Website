import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdEdit, MdSave, MdAdd, MdDelete, MdMyLocation } from "react-icons/md";
import ScheduleInput from '../../../fragments/schedule/ScheduleInput'; 

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
        <div className="w-8 h-8 mr-4 bg-gray-200 rounded-full"></div>
        <div className="w-32 h-8 bg-gray-200 rounded"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Basic Profile Section Skeleton */}
        <div className="p-6 mb-8 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="w-40 h-6 mb-6 bg-gray-200 rounded"></div>

          {/* Profile Picture Skeleton */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
            <div className="w-48 h-4 bg-gray-200 rounded"></div>
          </div>

          {/* Form Fields Skeleton */}
          <div className="space-y-4">
            <div>
              <div className="w-24 h-4 mb-2 bg-gray-200 rounded"></div>
              <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
            </div>
            <div>
              <div className="w-20 h-4 mb-2 bg-gray-200 rounded"></div>
              <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Details Section Skeleton */}
        <div className="p-6 mb-8 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="w-48 h-6 mb-6 bg-gray-200 rounded"></div>

          {/* Multiple form fields skeleton */}
          <div className="space-y-6">
            <div>
              <div className="w-16 h-4 mb-2 bg-gray-200 rounded"></div>
              <div className="w-full h-24 bg-gray-200 rounded-lg"></div>
            </div>
            <div>
              <div className="w-32 h-4 mb-2 bg-gray-200 rounded"></div>
              <div className="w-full h-24 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="w-20 h-4 mb-2 bg-gray-200 rounded"></div>
                  <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex flex-col gap-4 pt-6 sm:flex-row">
          <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

const EditProfileForm = () => {
  const [profile, setProfile] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    profile_picture: "",
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

  // Ref for Map
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isMapLoading, setIsMapLoading] = useState(false);

  // Get user role from profile or localStorage
  const getUserRole = () => {
    return profile?.role || localStorage.getItem("userRole") || "";
  };

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

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getProfile();
        const profileData = res.data;
        setProfile(profileData);
        setOriginalData(profileData);

        // Initialize form data
        setFormData({
          name: profileData.name || "",
          phone_number: profileData.phone_number || "",
          profile_picture: profileData.profile_picture || "",
        });
        setPhotoPreview(profileData.profile_picture || "");

        // Initialize details data based on role structure from API response
        const role = profileData.role;

        if (role === "farmer" && profileData.farmer) {
          setDetailsData({
            address: profileData.farmer.address || "",
            additional_info: profileData.farmer.additional_info || "",
            current_location_lat: profileData.farmer.current_location_lat || -8.243, 
            current_location_lng: profileData.farmer.current_location_lng || 115.321, 
          });
        } else if (role === "driver" && profileData.driver) {
          const pricingScheme = safeJsonParse(profileData.driver.pricing_scheme, {
            base_fee: 0,
            per_km: 0,
            extra_handling: 0,
          });
          const vehicleTypes = safeJsonParse(profileData.driver.vehicle_types, []);

          setDetailsData({
            company_address: profileData.driver.company_address || "",
            pricing_scheme: {
              base_fee: Number(pricingScheme.base_fee) || 0,
              per_km: Number(pricingScheme.per_km) || 0,
              extra_handling: Number(pricingScheme.extra_handling) || 0,
            },
            vehicle_types: vehicleTypes,
            newVehicleType: "",
          });
        } else if (role === "worker" && profileData.worker) {
          const skills = safeJsonParse(profileData.worker.skills, []);
          const availabilitySchedule = safeJsonParse(profileData.worker.availability_schedule, {});

          setDetailsData({
            skills: skills,
            hourly_rate: Number(profileData.worker.hourly_rate) || 0,
            daily_rate: Number(profileData.worker.daily_rate) || 0,
            address: profileData.worker.address || "",
            availability_schedule: {
              monday: "",
              tuesday: "",
              wednesday: "",
              thursday: "",
              friday: "",
              saturday: "",
              sunday: "",
              ...availabilitySchedule,
            },
            newSkill: "",
            current_location_lat: profileData.worker.current_location_lat || "",
            current_location_lng: profileData.worker.current_location_lng || "",
          });
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

  // Showing map
  useEffect(() => {
    const role = profile?.role;
    
    if (role !== "farmer" && role !== "worker") {
      return;
    }

    // Fungsi for map initialization
    const initMap = () => {
      
      if (!window.L || !mapRef.current || mapInstanceRef.current) return;

      const L = window.L;
      
      const initialLat = detailsData.current_location_lat || -8.243;
      const initialLng = detailsData.current_location_lng || 115.321;
      
      const map = L.map(mapRef.current).setView([initialLat, initialLng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Red icon
      const redIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      const marker = L.marker([initialLat, initialLng], {
        icon: redIcon,
        draggable: true,
      }).addTo(map);
      
      mapInstanceRef.current = map;
      markerRef.current = marker;

      marker.on('dragend', (e) => {
        const position = e.target.getLatLng();
        getAddressFromCoordinates(position.lat, position.lng);
      });

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        getAddressFromCoordinates(lat, lng);
      });

      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    };

     // Load CSS & JS Leaflet
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [profile, loading]);

  // Get address from cordinate
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      const addressText = data.display_name || `${lat}, ${lng}`;
      
      setDetailsData(prev => ({
        ...prev,
        address: addressText,
        current_location_lat: lat,
        current_location_lng: lng,
      }));
    } catch (error) {
      console.error('Gagal mengambil alamat:', error);

      setDetailsData(prev => ({
        ...prev,
        address: `Koordinat: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        current_location_lat: lat,
        current_location_lng: lng,
      }));
    }
  };

  // Get the current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung oleh browser Anda.');
      return;
    }
    setIsMapLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15); 
          markerRef.current.setLatLng([latitude, longitude]); 
          getAddressFromCoordinates(latitude, longitude);
        }
        setIsMapLoading(false);
      },
      (error) => {
        alert('Gagal mendapatkan lokasi: ' + error.message);
        setIsMapLoading(false);
      }
    );
  };

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
      [name]:
        name === "hourly_rate" || name === "daily_rate" ? Number(value) || 0 : value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleNestedDetailsChange = (parent, field, value) => {
    setDetailsData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: Number(value) || 0,
      },
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleScheduleChange = (day, value) => {
    setDetailsData((prev) => ({
      ...prev,
      availability_schedule: {
        ...prev.availability_schedule,
        [day]: value,
      },
    }));
  };

  const addSkill = () => {
    if (detailsData.newSkill && detailsData.newSkill.trim()) {
      setDetailsData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), prev.newSkill.trim()],
        newSkill: "",
      }));
    }
  };

  const removeSkill = (index) => {
    setDetailsData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((_, i) => i !== index),
    }));
  };

  const addVehicleType = () => {
    if (detailsData.newVehicleType && detailsData.newVehicleType.trim()) {
      setDetailsData((prev) => ({
        ...prev,
        vehicle_types: [...(prev.vehicle_types || []), prev.newVehicleType.trim()],
        newVehicleType: "",
      }));
    }
  };

  const removeVehicleType = (index) => {
    setDetailsData((prev) => ({
      ...prev,
      vehicle_types: (prev.vehicle_types || []).filter((_, i) => i !== index),
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

  const prepareDetailsForSubmission = () => {
    const currentDetails = { ...detailsData };

    // Remove temporary fields used for UI
    delete currentDetails.newSkill;
    delete currentDetails.newVehicleType;

    const role = getUserRole();

    if (role === "worker" || role === "farmer") {
    // Convert lat/lng to numbers if they exist and are not empty
      if (currentDetails.current_location_lat && currentDetails.current_location_lat !== "") {
        currentDetails.current_location_lat = Number(currentDetails.current_location_lat);
      } else {
        delete currentDetails.current_location_lat;
      }

      if (currentDetails.current_location_lng && currentDetails.current_location_lng !== "") {
        currentDetails.current_location_lng = Number(currentDetails.current_location_lng);
      } else {
        delete currentDetails.current_location_lng;
      }

      if (role === "worker" && currentDetails.availability_schedule) {
        const cleanedSchedule = {};
        Object.entries(currentDetails.availability_schedule).forEach(([day, time]) => {
          if (time && time.trim() !== "") {
            cleanedSchedule[day] = time.trim();
          }
        });
        currentDetails.availability_schedule = cleanedSchedule;
      }
    } else if (role === "driver") {
      // Ensure pricing scheme has proper number types
      if (currentDetails.pricing_scheme) {
        currentDetails.pricing_scheme = {
          base_fee: Number(currentDetails.pricing_scheme.base_fee) || 0,
          per_km: Number(currentDetails.pricing_scheme.per_km) || 0,
          extra_handling: Number(currentDetails.pricing_scheme.extra_handling) || 0,
        };
      }
    }

    return currentDetails;
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
      // Step 1: Handle profile picture upload first
      let profilePhotoUrl = formData.profile_picture;
      if (photoFile) {
        const photoRes = await uploadProfilePhoto(photoFile);
        profilePhotoUrl = photoRes.data.url;
      }

      // Step 2: Update basic profile info with the new or existing photo URL
      const profileDataToSubmit = {
        name: formData.name.trim(),
        phone_number: formData.phone_number.trim(),
        profile_picture: profilePhotoUrl, // Make sure to include the photo URL
      };

      await editProfile(profileDataToSubmit);

      // Step 3: Update details based on role
      const role = getUserRole();
      if (role && Object.keys(detailsData).length > 0) {
        const detailsToSubmit = prepareDetailsForSubmission();
        console.log("Submitting details:", detailsToSubmit);
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
              <label className="block mb-2 text-sm font-medium text-main_text">
                Alamat dan Lokasi di Peta
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <textarea
                    name="address"
                    value={detailsData.address || ""}
                    onChange={(e) => setDetailsData(prev => ({ ...prev, address: e.target.value }))}
                    rows={2}
                    className="flex-1 w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    placeholder="Alamat akan terisi otomatis dari peta"
                    disabled={saving}
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isMapLoading || saving}
                    className="px-4 py-3 text-white transition-colors rounded-lg bg-main hover:bg-green-600 disabled:bg-gray-400"
                    title="Gunakan lokasi saya saat ini"
                  >
                    {isMapLoading ? (
                      <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                    ) : (
                      <MdMyLocation size={20} />
                    )}
                  </button>
                </div>
                
                <div 
                  ref={mapRef}
                  className="z-0 w-full h-64 bg-gray-100 border border-gray-300 rounded-lg"
                />
                
                <div className="text-xs text-gray-500">
                  Klik pada peta atau geser penanda untuk mengubah lokasi.
                </div>
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-main_text">
                Informasi Tambahan
              </label>
              <textarea
                name="additional_info"
                value={detailsData.additional_info || ""}
                onChange={handleDetailsChange}
                rows={4}
                className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
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
              <label className="block mb-2 text-sm font-medium text-main_text">
                Alamat Perusahaan
              </label>
              <textarea
                name="company_address"
                value={detailsData.company_address || ""}
                onChange={handleDetailsChange}
                rows={2}
                className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                placeholder="Masukkan alamat perusahaan"
                disabled={saving}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block mb-2 text-sm font-medium text-main_text">
                  Tarif Dasar (Rp)
                </label>
                <input
                  type="number"
                  value={detailsData.pricing_scheme?.base_fee || 0}
                  onChange={(e) => handleNestedDetailsChange('pricing_scheme', 'base_fee', e.target.value)}
                  className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  placeholder="50000"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-main_text">
                  Per KM (Rp)
                </label>
                <input
                  type="number"
                  value={detailsData.pricing_scheme?.per_km || 0}
                  onChange={(e) => handleNestedDetailsChange('pricing_scheme', 'per_km', e.target.value)}
                  className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  placeholder="2500"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-main_text">
                  Biaya Tambahan (Rp)
                </label>
                <input
                  type="number"
                  value={detailsData.pricing_scheme?.extra_handling || 0}
                  onChange={(e) => handleNestedDetailsChange('pricing_scheme', 'extra_handling', e.target.value)}
                  className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  placeholder="15000"
                  disabled={saving}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-main_text">
                Jenis Kendaraan
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={detailsData.newVehicleType || ""}
                  onChange={(e) => setDetailsData(prev => ({ ...prev, newVehicleType: e.target.value }))}
                  className="flex-1 px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  placeholder="Tambah jenis kendaraan"
                  disabled={saving}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addVehicleType();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addVehicleType}
                  className="px-4 py-3 text-white transition-colors rounded-lg bg-main hover:bg-green-600"
                  disabled={saving}
                >
                  <MdAdd size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {(detailsData.vehicle_types || []).map((vehicle, index) => (
                  <div key={index} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50">
                    <span className="text-main_text">{vehicle}</span>
                    <button
                      type="button"
                      onClick={() => removeVehicleType(index)}
                      className="transition-colors text-danger hover:text-red-700"
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
              <label className="block mb-2 text-sm font-medium text-main_text">
                Keahlian
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={detailsData.newSkill || ""}
                  onChange={(e) => setDetailsData(prev => ({ ...prev, newSkill: e.target.value }))}
                  className="flex-1 px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  placeholder="Tambah keahlian"
                  disabled={saving}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-3 text-white transition-colors rounded-lg bg-main hover:bg-green-600"
                  disabled={saving}
                >
                  <MdAdd size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {(detailsData.skills || []).map((skill, index) => (
                  <div key={index} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50">
                    <span className="text-main_text">{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="transition-colors text-danger hover:text-red-700"
                      disabled={saving}
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-main_text">
                  Tarif per Jam (Rp)
                </label>
                <input
                  type="number"
                  name="hourly_rate"
                  value={detailsData.hourly_rate || 0}
                  onChange={handleDetailsChange}
                  className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  placeholder="25000"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-main_text">
                  Tarif per Hari (Rp)
                </label>
                <input
                  type="number"
                  name="daily_rate"
                  value={detailsData.daily_rate || 0}
                  onChange={handleDetailsChange}
                  className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  placeholder="150000"
                  disabled={saving}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-main_text">
                Alamat dan Lokasi di Peta
              </label>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <textarea
                    name="address"
                    value={detailsData.address || ""}
                    onChange={(e) => setDetailsData(prev => ({ ...prev, address: e.target.value }))}
                    rows={2}
                    className="flex-1 w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    placeholder="Alamat akan terisi otomatis dari peta"
                    disabled={saving}
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isMapLoading || saving}
                    className="px-4 py-3 text-white transition-colors rounded-lg bg-main hover:bg-green-600 disabled:bg-gray-400"
                    title="Gunakan lokasi saya saat ini"
                  >
                    {isMapLoading ? (
                      <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                    ) : (
                      <MdMyLocation size={20} />
                    )}
                  </button>
                </div>
                
                {/* Div for load map */}
                <div 
                  ref={mapRef}
                  className="z-0 w-full h-64 bg-gray-100 border border-gray-300 rounded-lg"
                />
                
                <div className="text-xs text-gray-500">
                  Klik pada peta atau geser penanda untuk mengubah lokasi.
                </div>
              </div>
            </div>

            {/* Menggunakan Schedule Input dari components/fragments/schedule */}
            <div>
              <label className="block mb-2 text-sm font-medium text-main_text">
                Jadwal Ketersediaan
              </label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                  <ScheduleInput
                    key={day}
                    day={day}
                    
                    value={detailsData.availability_schedule?.[day] || ""} 
                    
                    onChange={(newValue) => handleScheduleChange(day, newValue)}
                    disabled={saving}
                  />
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
      <div className="min-h-screen p-4 bg-gray-50">
        <SkeletonLoader />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4 text-gray-500">Gagal memuat data profil</p>
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
          className="p-2 mr-4 text-gray-600 transition-colors rounded-full hover:text-gray-800 hover:bg-gray-100"
        >
          <MdArrowBack size={24} />
        </button>
        <h2 className="text-2xl font-bold text-main">Edit Profil</h2>
      </div>

      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="p-4 mb-6 border-l-4 border-red-500 rounded-r-lg bg-red-50">
            <span className="font-medium text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 mb-6 border-l-4 border-green-500 rounded-r-lg bg-green-50">
            <span className="font-medium text-green-700">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Profile Section */}
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
            <h3 className="mb-6 text-lg font-semibold text-main">Informasi Umum</h3>

            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <img
                  src={photoPreview || "/placeholder-avatar.png"}
                  alt="Preview"
                  className="object-cover w-32 h-32 border-4 rounded-full border-main"
                  onError={(e) => {
                    e.target.src = "/placeholder-avatar.png";
                  }}
                />
                <button
                  type="button"
                  onClick={handleEditPhoto}
                  className="absolute bottom-0 right-0 p-2 text-white transition-colors rounded-full bg-main hover:bg-green-600"
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
                  className="block mb-2 text-sm font-medium text-main_text"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  placeholder="Masukkan nama lengkap"
                  disabled={saving}
                />
              </div>

              <div>
                <label
                  htmlFor="phone_number"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Nomor HP
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  placeholder="Masukkan nomor HP"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          {/* Details Section based on role */}
          {getUserRole() && (
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
              <h3 className="mb-6 text-lg font-semibold text-main">
                Informasi{" "}
                {getUserRole() === "farmer"
                  ? "Petani"
                  : getUserRole() === "driver"
                    ? "Ekspedisi"
                    : getUserRole() === "worker"
                      ? "Pekerja"
                      : getUserRole()}
              </h3>

              <div className="space-y-6">{renderDetailsForm()}</div>
            </div>
          )}

          <div className="flex flex-col gap-4 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={saving}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-medium text-white transition-colors rounded-lg bg-main hover:bg-green-600 disabled:bg-gray-400"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
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