import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdSave, MdEdit, MdWarning, MdUpload, MdClose } from "react-icons/md";
import {
  createProduct,
  updateProduct,
  getProductsById,
  // Asumsi service ini sudah ada
  uploadProductImage,
} from "../../../../../services/productServices";

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
            {/* ... (sisa kode skeleton) ... */}
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
    // Ini akan menjadi 'stock' di backend
    available_stock: "",
  });

  // [STATE BARU] Untuk mengelola file dan URL
  const [imageUrls, setImageUrls] = useState([]); // URL yang sudah sukses diupload ke Go
  const [uploadingImage, setUploadingImage] = useState(false); // Status loading upload

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
          });
          // Mengisi state URL dari data yang dimuat
          setImageUrls(data.image_urls || []);
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

  // [FUNGSI UTAMA] Mengunggah file ke backend
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validasi: Maksimal 5 file
    if (imageUrls.length + files.length > 5) {
      setError("Maksimal 5 gambar diperbolehkan.");
      e.target.value = null;
      return;
    }

    setError("");
    setUploadingImage(true);

    for (const file of files) {
      try {
        const response = await uploadProductImage(file);
        const responseData = response?.data;
        const uploadedUrl = responseData?.data?.url || responseData?.url;

        if (uploadedUrl) {
          // Simpan URL yang sudah sukses ke state
          setImageUrls((prev) => [...prev, uploadedUrl]);
        } else {
          // Tangani kasus di mana respons sukses (200) tetapi payload JSON malformed/tidak terduga
          throw new Error("Struktur respons server tidak valid atau URL hilang.");
        }
      } catch (err) {
        // Tangani error dari API atau error struktur
        const errorMessage = err.message || "Gagal mengunggah gambar.";
        setError(errorMessage);
        console.error("Upload Error:", err);

        // Hentikan proses jika satu file gagal diupload
        break;
      }
    }
    setUploadingImage(false);
    // Bersihkan input file agar bisa memilih file yang sama lagi
    e.target.value = null;
  };
  const handleRemoveImage = (urlToRemove) => {
    // Filter array URL untuk menghapus URL yang diminta
    setImageUrls((prev) => prev.filter(url => url !== urlToRemove));
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
    if (imageUrls.length === 0) {
      setError("Setidaknya satu gambar produk wajib diunggah.");
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

  // Fungsi modal
  const handleConfirmSubmit = async () => {
    setConfirmModalOpen(false);
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // [PERBAIKAN] Data yang dikirim: array URL dan 'stock' dari 'available_stock'
      const dataToSubmit = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        price: parseFloat(formData.price),
        stock: parseInt(formData.available_stock),
        image_urls: imageUrls, // <-- KIRIM ARRAY URL
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
        `Error ${ isEditMode ? "updating" : "creating" } product:`,
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

          {/* [PERBAIKAN] Upload/Display Gambar */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Gambar Produk ({imageUrls.length} / 5) *
            </label>

            <div className="flex flex-wrap gap-4 mb-4">
              {/* Tampilan Gambar yang Sudah Diupload */}
              {imageUrls.map((url) => (
                <div key={url} className="relative w-24 h-24 overflow-hidden border rounded-lg group">
                  <img src={url} alt="Produk" className="object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(url)}
                    className="absolute inset-0 flex items-center justify-center text-white transition-opacity bg-black rounded-lg opacity-0 bg-opacity-50 group-hover:opacity-100"
                    disabled={saving || uploadingImage}
                  >
                    <MdClose size={20} />
                  </button>
                </div>
              ))}

              {/* Input File Button */}
              {imageUrls.length < 5 && (
                <label
                  className={`w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors ${ uploadingImage ? 'bg-gray-200' : 'hover:border-green-500' }`}
                  htmlFor="image-upload-input"
                >
                  {uploadingImage ? (
                    <div className="w-6 h-6 border-2 border-gray-600 rounded-full animate-spin border-t-transparent"></div>
                  ) : (
                    <>
                      <MdUpload size={24} className="text-gray-500" />
                      <span className="text-xs text-gray-500">Upload ({5 - imageUrls.length} lagi)</span>
                    </>
                  )}
                  <input
                    id="image-upload-input"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFileChange}
                    className="sr-only"
                    disabled={saving || uploadingImage}
                  />
                </label>
              )}
            </div>
            {uploadingImage && (
              <p className="mt-1 text-sm text-blue-500">Sedang mengunggah. Mohon tunggu...</p>
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