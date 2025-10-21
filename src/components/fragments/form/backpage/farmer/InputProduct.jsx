import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdSave, MdEdit, MdWarning } from "react-icons/md";
import {
  createProduct,
  updateProduct,
  getProductsById,
} from "../../../../../services/productServices"; // Pastikan path ini benar

// Skeleton Loading Component
const ProductFormSkeleton = () => {
  return (
    <div className="p-2">
      <div className="animate-pulse">
        {/* Header Skeleton */}
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
    image_urls: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { productId: id } = useParams();
  const isEditMode = Boolean(id);

  // State untuk mengontrol modal konfirmasi
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

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
            image_urls: data.image_urls ? data.image_urls.join(", ") : "",
          });
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

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Nama produk tidak boleh kosong.");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Deskripsi tidak boleh kosong.");
      return false;
    }
    if (!formData.category.trim()) {
      setError("Kategori tidak boleh kosong.");
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

  //  Fungsi modal
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
        image_urls: formData.image_urls
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url),
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
      {/* ... Form Header ... */}
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
        {/* ... Pesan Error dan Success ... */}
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
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                placeholder="Contoh: Kopi"
                disabled={saving}
                required
              />
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
                Stok Tersedia (pcs) *
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
              htmlFor="image_urls"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              URL Gambar
            </label>
            <input
              type="text"
              id="image_urls"
              name="image_urls"
              value={formData.image_urls}
              onChange={handleInputChange}
              className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
              placeholder="Pisahkan dengan koma jika lebih dari satu"
              disabled={saving}
            />
            <p className="mt-1 text-xs text-gray-500">
              Contoh: https://url1.jpg, https://url2.jpg
            </p>
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
