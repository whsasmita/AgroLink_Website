import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdSave, MdEdit, MdMyLocation } from "react-icons/md";
import { 
  createProject, 
  // updateProject, 
  getProjectById 
} from "../../../../../services/projectService";

// Skeleton Loading Component
const ProjectFormSkeleton = () => {
  return (
    <div className="p-2">
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 mr-4 bg-gray-200 rounded-full"></div>
          <div className="w-40 h-8 bg-gray-200 rounded"></div>
        </div>

        <div className="max-w-2xl mx-auto">
          <form className="space-y-6">
            {/* Project Name Field */}
            <div>
              <div className="w-24 h-4 mb-2 bg-gray-200 rounded"></div>
              <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
            </div>

            {/* Description Field */}
            <div>
              <div className="w-20 h-4 mb-2 bg-gray-200 rounded"></div>
              <div className="w-full h-24 bg-gray-200 rounded-lg"></div>
            </div>

            {/* Location Field */}
            <div>
              <div className="w-16 h-4 mb-2 bg-gray-200 rounded"></div>
              <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
            </div>

            {/* Workers Needed Field */}
            <div>
              <div className="w-40 h-4 mb-2 bg-gray-200 rounded"></div>
              <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="w-24 h-4 mb-2 bg-gray-200 rounded"></div>
                <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
              </div>
              <div>
                <div className="h-4 mb-2 bg-gray-200 rounded w-28"></div>
                <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>

            {/* Payment Fields */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="h-4 mb-2 bg-gray-200 rounded w-36"></div>
                <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
              </div>
              <div>
                <div className="h-4 mb-2 bg-gray-200 rounded w-28"></div>
                <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-6 sm:flex-row">
              <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const allPaymentTypes = [
  { value: "per_hour", label: "Per Jam" },
  { value: "per_day", label: "Per Hari" },
  { value: "per_week", label: "Per Minggu" },
  { value: "per_month", label: "Per Bulan" },
  { value: "per_project", label: "Per Proyek" },
];

const InputProject = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    location_lat: -8.243,
    location_lng: 115.321,
    workers_needed: "",
    start_date: "",
    end_date: "",
    payment_rate: "50000",
    payment_type: "per_day"
  });
  
  // State for dynamic payment options
  const [availablePaymentTypes, setAvailablePaymentTypes] = useState(
     allPaymentTypes.filter(opt => ["per_hour", "per_day", "per_project"].includes(opt.value))
  );

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { projectId: id } = useParams();
  // const { id } = useParams(); 
  const isEditMode = Boolean(id);

  // Refs for Map
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isMapLoading, setIsMapLoading] = useState(false);

  // Load existing data if edit
  useEffect(() => {
    const fetchProject = async () => {
      if (!isEditMode) return;
      setLoading(true);
      try {
        const response = await getProjectById(id);
        if (response.status === "success" && response.data) {
          const data = response.data;
          setFormData({
            title: data.title || "",
            description: data.description || "",
            location: data.location || "",
            location_lat: data.location_lat || -8.243,
            location_lng: data.location_lng || 115.321,
            workers_needed: data.workers_needed?.toString() || "",
            start_date: data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : "",
            end_date: data.end_date ? new Date(data.end_date).toISOString().split('T')[0] : "",
            payment_rate: data.payment_rate?.toString() || "50000",
            payment_type: data.payment_type || "per_day"
          });
        } else {
          setError("Gagal memuat data proyek.");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(err.message || "Gagal memuat data proyek.");
      } finally {
        setLoading(false);
      }
    };
    
    if (isEditMode) {
        fetchProject();
    } else {
        setFormData(prev => ({
            ...prev,
            location_lat: prev.location_lat || -8.243,
            location_lng: prev.location_lng || 115.321,
        }));
        setLoading(false);
    }
    // fetchProject();
  }, [id, isEditMode]);

  // useEffect for Map Initialization
  useEffect(() => {
    
    // Only run if not loading initial data and map ref exists
    if (loading || !mapRef.current) return;

    // Function for map initialization
    const initMap = () => {
      if (!window.L || !mapRef.current || mapInstanceRef.current) return;

      const L = window.L;

      // Use coordinates from formData state
      const initialLat = formData.location_lat || -8.243;
      const initialLng = formData.location_lng || 115.321;

      const map = L.map(mapRef.current).setView([initialLat, initialLng], 13);
      mapInstanceRef.current = map; 

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Red icon
      const redIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
      });

      const marker = L.marker([initialLat, initialLng], {
         icon: redIcon,
         draggable: true
      }).addTo(map);
      markerRef.current = marker;

      // Event listener for marker drag
      marker.on('dragend', (e) => {
        const position = e.target.getLatLng();
        getAddressFromCoordinates(position.lat, position.lng);
      });

      // Event listener for map click
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        getAddressFromCoordinates(lat, lng);
      });

      // Adjust map size after initialization
       setTimeout(() => { map.invalidateSize() }, 100);
    };

    // Load Leaflet CSS & JS dynamically
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

    // Cleanup function to remove map instance when component unmounts
    return () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
            markerRef.current = null; 
        }
    };
  }, [loading]);

  // Get address from coordinates
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      const addressText = data.display_name || `Koordinat: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;

      // Update formData state
      setFormData(prev => ({
        ...prev,
        location: addressText, 
        location_lat: lat,
        location_lng: lng,
      }));
    } catch (error) {
      console.error('Gagal mengambil alamat:', error);
      
      // Update formData state even on error
      setFormData(prev => ({
        ...prev,
        location: `Koordinat: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        location_lat: lat,
        location_lng: lng,
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

  // useEffect to update available payment types based on dates
  useEffect(() => {
    const { start_date, end_date } = formData;

    if (start_date && end_date) {
      try {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        // validation before calculating
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate < startDate) {
          
           setAvailablePaymentTypes(allPaymentTypes.filter(opt => ["per_hour", "per_day", "per_project"].includes(opt.value)));
           return;
        }

        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        let validTypes = [];
        if (diffDays >= 30) { 
          validTypes = ["per_hour", "per_day", "per_week", "per_month", "per_project"];
        } else if (diffDays >= 7) {
          validTypes = ["per_hour", "per_day", "per_week", "per_project"];
        } else {
          validTypes = ["per_hour", "per_day", "per_project"];
        }

        const newAvailableOptions = allPaymentTypes.filter(opt => validTypes.includes(opt.value));
        setAvailablePaymentTypes(newAvailableOptions);

        // Reset payment_type 
        const currentTypeIsValid = newAvailableOptions.some(opt => opt.value === formData.payment_type);
        if (!currentTypeIsValid && newAvailableOptions.length > 0) {
          
           // Reset to the first available option
           const defaultOption = newAvailableOptions.find(opt => opt.value === 'per_day') || newAvailableOptions[0];
          setFormData(prev => ({ ...prev, payment_type: defaultOption.value }));
        } else if (!currentTypeIsValid && newAvailableOptions.length === 0) {
             
             setFormData(prev => ({ ...prev, payment_type: "" }));
        }

      } catch (e) {
        console.error("Error calculating date difference:", e);
        
        setAvailablePaymentTypes(allPaymentTypes.filter(opt => ["per_hour", "per_day", "per_project"].includes(opt.value)));
      }
    } else {
       // If one or both dates are missing
       setAvailablePaymentTypes(allPaymentTypes.filter(opt => ["per_hour", "per_day", "per_project"].includes(opt.value)));
        // reset payment type if dates become incomplete
        const currentTypeIsValid = availablePaymentTypes.some(opt => opt.value === formData.payment_type);
         if (!currentTypeIsValid && availablePaymentTypes.length > 0) {
            const defaultOption = availablePaymentTypes.find(opt => opt.value === 'per_day') || availablePaymentTypes[0];
            setFormData(prev => ({ ...prev, payment_type: defaultOption.value }));
         }
    }
  }, [formData.start_date, formData.end_date]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Nama proyek tidak boleh kosong.");
      return false;
    }
    if (!formData.location.trim()) {
      setError("Lokasi tidak boleh kosong.");
      return false;
    }
    if (!formData.workers_needed) {
      setError("Jumlah pekerja tidak boleh kosong.");
      return false;
    }
    if (!formData.start_date) {
      setError("Tanggal mulai tidak boleh kosong.");
      return false;
    }
    if (!formData.end_date) {
      setError("Tanggal selesai tidak boleh kosong.");
      return false;
    }
    if (!formData.payment_rate) {
      setError("Tarif pembayaran tidak boleh kosong.");
      return false;
    }
    if (!formData.payment_type) {
      setError("Tipe pembayaran tidak boleh kosong.");
      return false;
    }

    // Validate numeric values
    const workersNeeded = parseInt(formData.workers_needed);
    const paymentRate = parseFloat(formData.payment_rate);
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (isNaN(workersNeeded) || workersNeeded <= 0) {
      setError("Jumlah pekerja harus berupa angka positif.");
      return false;
    }
    
    // if (isNaN(paymentRate) || paymentRate <= 0) {
    //   setError("Tarif pembayaran harus berupa angka positif.");
    //   return false;
    // }
    // Payment Rate Validation
    if (isNaN(paymentRate) || paymentRate < 50000) {
      setError("Tarif pembayaran minimal Rp 50.000.");
      return false;
    }

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) { setError("Format tanggal tidak valid."); return false; }
    if (endDate < startDate) { setError("Tanggal selesai harus setelah atau sama dengan tanggal mulai."); return false; }

    // Validate date range
    // const startDate = new Date(formData.start_date);
    // const endDate = new Date(formData.end_date);
    
    // if (endDate < startDate) {
    //   setError("Tanggal selesai harus setelah tanggal mulai.");
    //   return false;
    // }

    // Validation if payment type is valid for the duration
    const currentTypeIsValid = availablePaymentTypes.some(opt => opt.value === formData.payment_type);
    if (!currentTypeIsValid) {
      setError("Tipe Pembayaran yang dipilih tidak valid untuk durasi proyek saat ini. Silakan pilih lagi.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // if (!validateForm()) return;
    if (!validateForm()) {
        return; 
    }

    setSaving(true);

    try {
      
      const dataToSubmit = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        location_lat: formData.location_lat ? Number(formData.location_lat) : null,
        location_lng: formData.location_lng ? Number(formData.location_lng) : null,
        workers_needed: parseInt(formData.workers_needed),
        start_date: formData.start_date,
        end_date: formData.end_date,
        payment_rate: parseFloat(formData.payment_rate),
        payment_type: formData.payment_type,
      };
      
      if (dataToSubmit.location_lat === null) delete dataToSubmit.location_lat;
      if (dataToSubmit.location_lng === null) delete dataToSubmit.location_lng;
      
      // Debugging
      // console.log("Submitting Data:", dataToSubmit); 
      
      let response;
      if (isEditMode) {
        // Debugging
        // console.log("Calling updateProject with ID:", id); 
        response = await updateProject(id, dataToSubmit);
      } else {
        response = await createProject(dataToSubmit);
      }
      
      if (response.status === "success") {
        const message = isEditMode 
          ? "Proyek berhasil diperbarui!" 
          : "Proyek berhasil ditambahkan!";
        setSuccess(message);

        setTimeout(() => {
          navigate("/dashboard/projects");
        }, 1500);
      } else {
        setError(response.message || "Terjadi kesalahan. Silakan coba lagi.");
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} project:`, err);
      const message = isEditMode 
        ? "Gagal memperbarui proyek." 
        : "Gagal menambahkan proyek.";
      setError(err.message || message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/projects");
  };

  // skeleton loading when fetching data
  if (loading && isEditMode) { 
    return <ProjectFormSkeleton />;
  }

  const pageTitle = isEditMode ? "Edit Proyek" : "Tambah Proyek";
  const submitButtonText = isEditMode ? "Update Proyek" : "Simpan Proyek";
  const savingText = isEditMode ? "Memperbarui..." : "Menyimpan...";

  return (
    <div className="p-2">
      <div className="flex items-center mb-6">
        <button
          onClick={handleCancel}
          className="p-2 mr-4 text-gray-600 transition-colors rounded-full hover:text-gray-800 hover:bg-gray-100"
          disabled={saving}
        >
          <MdArrowBack size={24} />
        </button>
        <h2 className="text-2xl font-bold text-main">{pageTitle}</h2>
      </div>

      <div className="max-w-5xl mx-auto">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Nama Proyek *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
              placeholder="Contoh: Proyek Pembangunan Irigasi"
              disabled={saving}
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Deskripsi *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-main focus:border-transparent"
              placeholder="Deskripsi detail proyek..."
              disabled={saving}
              required
            ></textarea>
          </div>

          {/* <div>
            <label
              htmlFor="location"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Lokasi & Peta *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
              placeholder="Contoh: Jalan Sukamaju, Singaraja"
              disabled={saving}
              required
            />
          </div> */}
          {/* Location Input with Map */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Lokasi & Peta *
            </label>
            <div className="space-y-3">
              {/* Address Text Area */}
              <div className="flex gap-2">
                <textarea
                  name="location" 
                  value={formData.location}
                  onChange={handleInputChange} 
                  rows={2}
                  className="flex-1 w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  placeholder="Alamat akan terisi otomatis dari peta atau ketik manual"
                  disabled={saving}
                  required 
                />
                {/* Get Current Location Button */}
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

              {/* Map Container */}
              <div
                ref={mapRef}
                className="z-0 w-full h-64 bg-gray-100 border border-gray-300 rounded-lg" 
              />

              {/* Helper Text */}
              <div className="text-xs text-gray-500">
                Klik pada peta atau geser penanda merah untuk memilih lokasi proyek. Alamat akan terisi otomatis.
              </div>

              <div className="text-xs text-gray-500">
                  Koordinat: {formData.location_lat?.toFixed(5) || '-'}, {formData.location_lng?.toFixed(5) || '-'}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="workers_needed"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Jumlah Pekerja Dibutuhkan *
            </label>
            <input
              type="number"
              min="1"
              id="workers_needed"
              name="workers_needed"
              value={formData.workers_needed}
              onChange={handleInputChange}
              className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
              placeholder="Contoh: 5"
              disabled={saving}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="start_date"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Tanggal Mulai *
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                disabled={saving}
                required
              />
            </div>

            <div>
              <label
                htmlFor="end_date"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Tanggal Selesai *
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                disabled={saving}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="payment_rate"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Tarif Pembayaran (Rp) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                id="payment_rate"
                name="payment_rate"
                value={formData.payment_rate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 transition-colors border rounded-lg focus:ring-2 focus:border-transparent ${

                  formData.payment_rate && parseFloat(formData.payment_rate) < 50000
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-main'
                }`}
                placeholder="Contoh: 100000"
                disabled={saving}
                required
              />

              {formData.payment_rate && parseFloat(formData.payment_rate) < 50000 && (
                <p className="mt-1 text-xs text-red-600">
                  Tarif pembayaran minimal Rp 50.000.
                </p>
              )}

            </div>

            <div>
              <label
                htmlFor="payment_type"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Tipe Pembayaran *
              </label>
              <select
                id="payment_type"
                name="payment_type"
                value={formData.payment_type}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 transition-colors border rounded-lg focus:ring-2 focus:ring-main focus:border-transparent ${!formData.start_date || !formData.end_date ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'}`}
                disabled={saving || !formData.start_date || !formData.end_date}
                required
              >
                {/* Default placeholder for dates and options */}
                {(!formData.start_date || !formData.end_date || availablePaymentTypes.length === 0) && (
                  <option value="" disabled>Pilih Tanggal Dulu</option>
                )}
                 {/* Map available options */}
                {availablePaymentTypes.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {(!formData.start_date || !formData.end_date) && (
                  <p className="mt-1 text-xs text-gray-500">Pilih tanggal mulai dan selesai untuk melihat opsi pembayaran.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-medium text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                  {savingText}
                </>
              ) : (
                <>
                  {isEditMode ? <MdEdit size={20} /> : <MdSave size={20} />}
                  {submitButtonText}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputProject;