import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdSave, MdEdit } from "react-icons/md";
import { 
  createAgriculturalLand, 
  updateAgriculturalLand, 
  getAgriculturalLandById 
} from "../../../../../services/farmerService";

const AgriculturalLandForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    area_size: "",
    crop_type: "",
    irrigation_type: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL params
  const isEditMode = Boolean(id);

  // Load existing data if editing
  useEffect(() => {
    const fetchAgriculturalLand = async () => {
      if (!isEditMode) return;

      setLoading(true);
      try {
        const response = await getAgriculturalLandById(id);
        if (response.status === "success" && response.data) {
          const data = response.data;
          setFormData({
            name: data.name || "",
            latitude: data.latitude?.toString() || "",
            longitude: data.longitude?.toString() || "",
            area_size: data.area_size?.toString() || "",
            crop_type: data.crop_type || "",
            irrigation_type: data.irrigation_type || "",
            description: data.description || ""
          });
        } else {
          setError("Gagal memuat data lahan pertanian.");
        }
      } catch (err) {
        console.error("Error fetching agricultural land:", err);
        setError(err.message || "Gagal memuat data lahan pertanian.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgriculturalLand();
  }, [id, isEditMode]);

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
    if (!formData.name.trim()) {
      setError("Nama lahan tidak boleh kosong.");
      return false;
    }
    if (!formData.latitude) {
      setError("Latitude tidak boleh kosong.");
      return false;
    }
    if (!formData.longitude) {
      setError("Longitude tidak boleh kosong.");
      return false;
    }
    if (!formData.area_size) {
      setError("Luas area tidak boleh kosong.");
      return false;
    }
    if (!formData.crop_type.trim()) {
      setError("Jenis tanaman tidak boleh kosong.");
      return false;
    }
    if (!formData.irrigation_type.trim()) {
      setError("Jenis irigasi tidak boleh kosong.");
      return false;
    }

    // Validate numeric values
    const latitude = parseFloat(formData.latitude);
    const longitude = parseFloat(formData.longitude);
    const areaSize = parseFloat(formData.area_size);

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      setError("Latitude harus berupa angka antara -90 dan 90.");
      return false;
    }
    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      setError("Longitude harus berupa angka antara -180 dan 180.");
      return false;
    }
    if (isNaN(areaSize) || areaSize <= 0) {
      setError("Luas area harus berupa angka positif.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Convert string values to numbers
      const dataToSubmit = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        area_size: parseFloat(formData.area_size)
      };
      
      let response;
      if (isEditMode) {
        response = await updateAgriculturalLand(id, dataToSubmit);
      } else {
        response = await createAgriculturalLand(dataToSubmit);
      }
      
      if (response.status === "success") {
        const message = isEditMode 
          ? "Lahan pertanian berhasil diperbarui!" 
          : "Lahan pertanian berhasil ditambahkan!";
        setSuccess(message);

        setTimeout(() => {
          navigate("/dashboard/agricultural-land");
        }, 1500);
      } else {
        setError(response.message || "Terjadi kesalahan. Silakan coba lagi.");
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} agricultural land:`, err);
      const message = isEditMode 
        ? "Gagal memperbarui lahan pertanian." 
        : "Gagal menambahkan lahan pertanian.";
      setError(err.message || message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/agricultural-land");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-main border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Memuat data lahan pertanian...</p>
        </div>
      </div>
    );
  }

  const pageTitle = isEditMode ? "Edit Lahan Pertanian" : "Tambah Lahan Pertanian";
  const submitButtonText = isEditMode ? "Update Lahan" : "Simpan Lahan";
  const savingText = isEditMode ? "Memperbarui..." : "Menyimpan...";

  return (
    <div className="p-2">
      <div className="flex items-center mb-6">
        <button
          onClick={handleCancel}
          className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          disabled={saving}
        >
          <MdArrowBack size={24} />
        </button>
        <h2 className="text-2xl font-bold text-main">{pageTitle}</h2>
      </div>

      <div className="max-w-2xl mx-auto">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nama Lahan *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
              placeholder="Contoh: Kebun Kopi Organik"
              disabled={saving}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="latitude"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Latitude *
              </label>
              <input
                type="number"
                step="0.000001"
                min="-90"
                max="90"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                placeholder="Contoh: -8.2391"
                disabled={saving}
                required
              />
            </div>

            <div>
              <label
                htmlFor="longitude"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Longitude *
              </label>
              <input
                type="number"
                step="0.000001"
                min="-180"
                max="180"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                placeholder="Contoh: 114.9804"
                disabled={saving}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="area_size"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Luas Area (hektar) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              id="area_size"
              name="area_size"
              value={formData.area_size}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
              placeholder="Contoh: 50.5"
              disabled={saving}
              required
            />
          </div>

          <div>
            <label
              htmlFor="crop_type"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Jenis Tanaman *
            </label>
            <input
              type="text"
              id="crop_type"
              name="crop_type"
              value={formData.crop_type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
              placeholder="Contoh: Kopi Robusta"
              disabled={saving}
              required
            />
          </div>

          <div>
            <label
              htmlFor="irrigation_type"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Jenis Irigasi *
            </label>
            <input
              type="text"
              id="irrigation_type"
              name="irrigation_type"
              value={formData.irrigation_type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
              placeholder="Contoh: Irigasi Tetes (Drip Irrigation)"
              disabled={saving}
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors resize-none"
              placeholder="Deskripsi lahan pertanian (opsional)"
              disabled={saving}
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
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

export default AgriculturalLandForm;