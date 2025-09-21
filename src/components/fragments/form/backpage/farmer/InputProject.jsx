import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdSave, MdEdit } from "react-icons/md";
import { 
  createProject, 
//   updateProject, 
  getProjectById 
} from "../../../../../services/projectService";

// Skeleton Loading Component
const ProjectFormSkeleton = () => {
  return (
    <div className="p-2">
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gray-200 rounded-full mr-4"></div>
          <div className="h-8 bg-gray-200 rounded w-40"></div>
        </div>

        <div className="max-w-2xl mx-auto">
          <form className="space-y-6">
            {/* Project Name Field */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            </div>

            {/* Description Field */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-24 bg-gray-200 rounded-lg w-full"></div>
            </div>

            {/* Location Field */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            </div>

            {/* Workers Needed Field */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
              </div>
            </div>

            {/* Payment Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="h-4 bg-gray-200 rounded w-36 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const InputProject = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    workers_needed: "",
    start_date: "",
    end_date: "",
    payment_rate: "",
    payment_type: "per_day"
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
            workers_needed: data.workers_needed?.toString() || "",
            start_date: data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : "",
            end_date: data.end_date ? new Date(data.end_date).toISOString().split('T')[0] : "",
            payment_rate: data.payment_rate?.toString() || "",
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

    fetchProject();
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

    if (isNaN(workersNeeded) || workersNeeded <= 0) {
      setError("Jumlah pekerja harus berupa angka positif.");
      return false;
    }
    if (isNaN(paymentRate) || paymentRate <= 0) {
      setError("Tarif pembayaran harus berupa angka positif.");
      return false;
    }

    // Validate date range
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    
    if (endDate < startDate) {
      setError("Tanggal selesai harus setelah tanggal mulai.");
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
      // Convert string values to appropriate types
      const dataToSubmit = {
        ...formData,
        workers_needed: parseInt(formData.workers_needed),
        payment_rate: parseFloat(formData.payment_rate)
      };
      
      let response;
      if (isEditMode) {
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

  // Show skeleton loading when fetching data
  if (loading) {
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
          className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          disabled={saving}
        >
          <MdArrowBack size={24} />
        </button>
        <h2 className="text-2xl font-bold text-main">{pageTitle}</h2>
      </div>

      <div className="max-w-5xl mx-auto">
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
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nama Proyek *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
              placeholder="Contoh: Proyek Pembangunan Irigasi"
              disabled={saving}
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Deskripsi *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors resize-none"
              placeholder="Deskripsi detail proyek..."
              disabled={saving}
              required
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Lokasi *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
              placeholder="Contoh: Jalan Sukamaju, Singaraja"
              disabled={saving}
              required
            />
          </div>

          <div>
            <label
              htmlFor="workers_needed"
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
              placeholder="Contoh: 5"
              disabled={saving}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="start_date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tanggal Mulai *
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                disabled={saving}
                required
              />
            </div>

            <div>
              <label
                htmlFor="end_date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tanggal Selesai *
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                disabled={saving}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="payment_rate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tarif Pembayaran (Rp) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                id="payment_rate"
                name="payment_rate"
                value={formData.payment_rate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                placeholder="Contoh: 100000"
                disabled={saving}
                required
              />
            </div>

            <div>
              <label
                htmlFor="payment_type"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tipe Pembayaran *
              </label>
              <select
                id="payment_type"
                name="payment_type"
                value={formData.payment_type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition-colors"
                disabled={saving}
                required
              >
                <option value="per_hour">Per Jam</option>
                <option value="per_day">Per Hari</option>
                <option value="per_week">Per Minggu</option>
                <option value="per_month">Per Bulan</option>
                <option value="per_project">Per Proyek</option>
              </select>
            </div>
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

export default InputProject;