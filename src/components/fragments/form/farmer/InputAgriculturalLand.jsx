import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdSave } from "react-icons/md";
import { createAgriculturalLand } from "../../../../services/farmerService";
import Loading from "../../loading/Index";

const InputAgriculturalLand = () => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.name.trim()) {
      setError("Nama lahan tidak boleh kosong.");
      return;
    }
    if (!formData.latitude) {
      setError("Latitude tidak boleh kosong.");
      return;
    }
    if (!formData.longitude) {
      setError("Longitude tidak boleh kosong.");
      return;
    }
    if (!formData.area_size) {
      setError("Luas area tidak boleh kosong.");
      return;
    }
    if (!formData.crop_type.trim()) {
      setError("Jenis tanaman tidak boleh kosong.");
      return;
    }
    if (!formData.irrigation_type.trim()) {
      setError("Jenis irigasi tidak boleh kosong.");
      return;
    }

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
      
      const response = await createAgriculturalLand(dataToSubmit);
      
      if (response.status === "success") {
        setSuccess("Lahan pertanian berhasil ditambahkan!");

        setTimeout(() => {
          navigate("/profile/agricultural-land");
        }, 1000);
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Error creating agricultural land:", err);
      setError(err.message || "Gagal menambahkan lahan pertanian.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile/agricultural-land");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
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
        <h2 className="text-2xl font-bold text-main">Tambah Lahan Pertanian</h2>
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
                step="0.0001"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                placeholder="Contoh: -8.2391"
                disabled={saving}
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
                step="0.0001"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                placeholder="Contoh: 114.9804"
                disabled={saving}
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
              id="area_size"
              name="area_size"
              value={formData.area_size}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
              placeholder="Contoh: 50.5"
              disabled={saving}
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
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
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
                  Menyimpan...
                </>
              ) : (
                <>
                  <MdSave size={20} />
                  Simpan Lahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default InputAgriculturalLand;
