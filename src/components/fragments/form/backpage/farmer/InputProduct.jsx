import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdSave, MdEdit, MdWarning, MdClose } from "react-icons/md";
import {
  createProduct,
  updateProduct,
  getProductsById,
} from "../../../../../services/productServices";

// Skeleton Loading Component
const ProductFormSkeleton = () => {
  return (
    <div className="p-2">
      <div className="animate-pulse">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 mr-4 bg-gray-200 rounded-full"></div>
          <div className="w-40 h-8 bg-gray-200 rounded"></div>
        </div>

        <div className="max-w-5xl mx-auto">
          <form className="space-y-6">
            <div className="w-24 h-4 mb-2 bg-gray-200 rounded"></div>
            <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
            <div className="w-20 h-4 mb-2 bg-gray-200 rounded"></div>
            <div className="w-full h-24 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="w-16 h-4 mb-2 bg-gray-200 rounded"></div>
                <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
              </div>
              <div>
                <div className="w-16 h-4 mb-2 bg-gray-200 rounded"></div>
                <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="w-40 h-4 mb-2 bg-gray-200 rounded"></div>
                <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
              </div>
              <div>
                <div className="h-4 mb-2 bg-gray-200 rounded w-28"></div>
                <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
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

const InputProduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    price: "",
    available_stock: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { productId: id } = useParams();
  const isEditMode = Boolean(id);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const categories = [
    { value: "coffee", label: "Kopi" },
    { value: "fruit", label: "Buah-buahan" },
    { value: "vegetable", label: "Sayuran" },
    { value: "processed", label: "Produk Olahan" },
  ];

  // Load data produk jika dalam mode edit
  useEffect(() => {
    const fetchProduct = async () => {
      if (!isEditMode) return;

      setLoading(true);
      try {
        const response = await getProductsById(id);
        if (response.status === "success" && response.data) {
          const data = response.data;
          setFormData({
            title: data.title || "",
            description: data.description || "",
            category: data.category || "",
            location: data.location || "",
            price: data.price?.toString() || "",
            available_stock: data.available_stock?.toString() || "",
          });
          
          // Set preview gambar dari URL yang ada
          if (data.image_urls && data.image_urls.length > 0) {
            setImagePreviews(data.image_urls);
          }
        } else {
          setError("Gagal memuat data produk.");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Gagal memuat data produk.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imageFiles.length > 5) {
      setError("Maksimal 5 gambar yang dapat diupload.");
      return;
    }

    // Validasi ukuran file (max 5MB per file)
    const maxSize = 5 * 1024 * 1024;
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setError(`File ${file.name} terlalu besar. Maksimal 5MB per file.`);
        return false;
      }
      return true;
    });

    setImageFiles([...imageFiles, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    if (error) setError("");
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Nama produk tidak boleh kosong.");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Deskripsi tidak boleh kosong.");
      return false;
    }
    if (!formData.category) {
      setError("Kategori harus dipilih.");
      return false;
    }
    if (!formData.price) {
      setError("Harga tidak boleh kosong.");
      return false;
    }
    if (!formData.available_stock) {
      setError("Stok tidak boleh kosong.");
      return false;
    }

    const price = parseFloat(formData.price);
    const stock = parseInt(formData.available_stock);

    if (isNaN(price) || price <= 0) {
      setError("Harga harus berupa angka positif.");
      return false;
    }
    if (isNaN(stock) || stock < 0) {
      setError("Stok harus berupa angka positif atau nol.");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setConfirmModalOpen(true);
    }
  };

  const handleConfirmSubmit = async () => {
    setConfirmModalOpen(false);
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const dataToSubmit = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.available_stock),
        // Dalam implementasi nyata, Anda perlu upload file ke server terlebih dahulu
        // dan mendapatkan URL-nya. Untuk sementara, kita gunakan preview sebagai placeholder
        image_urls: imagePreviews.filter(url => typeof url === 'string' && url.startsWith('http'))
      };

      let response;
      if (isEditMode) {
        response = await updateProduct(id, dataToSubmit);
      } else {
        response = await createProduct(dataToSubmit);
      }

      if (response.status === "success") {
        const message = isEditMode
          ? "Produk berhasil diperbarui!"
          : "Produk berhasil ditambahkan!";
        setSuccess(message);
        setTimeout(() => {
          navigate("/dashboard/products");
        }, 1500);
      } else {
        setError(response.message || "Terjadi kesalahan.");
      }
    } catch (err) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} product:`,
        err
      );
      const message = isEditMode
        ? "Gagal memperbarui produk."
        : "Gagal menambahkan produk.";
      setError(err.message || message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/products");
  };

  if (loading) {
    return <ProductFormSkeleton />;
  }

  const pageTitle = isEditMode ? "Edit Produk" : "Tambah Produk";
  const submitButtonText = isEditMode ? "Update Produk" : "Simpan Produk";
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
              Nama Produk *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
              placeholder="Contoh: Kopi Arabika Gayo"
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
              placeholder="Deskripsi detail tentang produk Anda..."
              disabled={saving}
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Kategori *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                disabled={saving}
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="location"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Lokasi Asal Produk
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                placeholder="Contoh: Takengon, Aceh"
                disabled={saving}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Harga (Rp) *
              </label>
              <input
                type="number"
                min="1"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                placeholder="Contoh: 250000"
                disabled={saving}
                required
              />
            </div>
            <div>
              <label
                htmlFor="available_stock"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Stok Tersedia (Kg) *
              </label>
              <input
                type="number"
                min="0"
                id="available_stock"
                name="available_stock"
                value={formData.available_stock}
                onChange={handleInputChange}
                className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                placeholder="Contoh: 10"
                disabled={saving}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="images"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Gambar Produk
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="images"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG atau JPEG (Maks. 5MB per file)</p>
                </div>
                <input
                  id="images"
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageChange}
                  disabled={saving}
                />
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Maksimal 5 gambar. Gambar pertama akan menjadi gambar utama.
            </p>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-5">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="object-cover w-full h-32 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={saving}
                    >
                      <MdClose size={16} />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                        Utama
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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

      {/* Modal Konfirmasi */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-sm bg-white rounded-lg shadow-xl">
            <div className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full">
                <MdWarning className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Konfirmasi</h3>
              <p className="mt-2 text-sm text-gray-500">
                Apakah Anda yakin ingin{" "}
                {isEditMode ? "memperbarui" : "menyimpan"} data produk ini?
              </p>
            </div>
            <div className="flex gap-2 px-4 py-3 bg-gray-50 sm:px-6">
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                onClick={() => setConfirmModalOpen(false)}
                disabled={saving}
              >
                Batal
              </button>
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700"
                onClick={handleConfirmSubmit}
                disabled={saving}
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputProduct;