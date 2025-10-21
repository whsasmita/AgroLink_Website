import { useState, useEffect } from "react";
import {
  MdAdd,
  MdVisibility,
  MdEdit,
  MdDownload,
  MdWork,
  MdFilterList,
  MdSearch,
  MdClose,
  MdCheck,
  MdMail,
  MdInbox,
  MdReceipt,
  MdDelete,
  MdPayments,
} from "react-icons/md";

// --- Import service untuk mengambil data produk ---
import {
  getProducts,
  deleteProduct,
  getMyProducts,
} from "../../../../services/productServices";
import { useNavigate } from "react-router-dom";

// Skeleton Components
const SkeletonLine = ({ width = "w-full", height = "h-4" }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${width} ${height}`}></div>
);
const SkeletonBox = ({ width = "w-full", height = "h-4" }) => (
  <div
    className={`bg-gray-200 rounded-lg animate-pulse ${width} ${height}`}
  ></div>
);
const TableRowSkeleton = () => (
  <tr className="border-b border-gray-100">
    <td className="px-3 py-4 sm:px-6">
      <SkeletonLine width="w-6" height="h-4" />
    </td>
    <td className="px-3 py-4 sm:px-6">
      <SkeletonLine width="w-32" height="h-5" />
    </td>
    <td className="hidden px-3 py-4 sm:px-6 sm:table-cell">
      <SkeletonLine width="w-20" height="h-4" />
    </td>
    <td className="px-3 py-4 sm:px-6">
      <SkeletonLine width="w-16" height="h-4" />
    </td>
    <td className="px-3 py-4 sm:px-6">
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </td>
  </tr>
);
const LoadingSkeleton = () => (
  <div className="p-2 sm:p-4">
    <div className="flex flex-col items-start justify-between gap-4 p-4 mb-4 bg-white rounded-lg shadow-sm sm:flex-row sm:items-center">
      <div>
        <SkeletonLine width="w-48" height="h-8" />
        <div className="mt-2">
          <SkeletonLine width="w-64" height="h-4" />
        </div>
      </div>
      <SkeletonBox width="w-32" height="h-12" />
    </div>
    <div className="p-4 mb-4 bg-white border border-gray-100 rounded-lg shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <SkeletonBox width="w-full" height="h-12" />
        </div>
        <SkeletonBox width="w-20" height="h-12" />
      </div>
    </div>
    <div className="overflow-hidden bg-white rounded-lg shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-3 py-4 text-left sm:px-6">
                <SkeletonLine width="w-8" height="h-4" />
              </th>
              <th className="px-3 py-4 text-left sm:px-6">
                <SkeletonLine width="w-24" height="h-4" />
              </th>
              <th className="hidden px-3 py-4 text-left sm:px-6 sm:table-cell">
                <SkeletonLine width="w-28" height="h-4" />
              </th>
              <th className="px-3 py-4 text-left sm:px-6">
                <SkeletonLine width="w-20" height="h-4" />
              </th>
              <th className="px-3 py-4 text-center sm:px-6">
                <SkeletonLine width="w-12" height="h-4" />
              </th>
              <th className="px-3 py-4 text-center sm:px-6">
                <SkeletonLine width="w-24" height="h-4" />
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, index) => (
              <TableRowSkeleton key={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const ProductListPage = () => {
  // State untuk produk
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // State untuk filter
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    minPrice: "",
    maxPrice: "",
    minStock: "",
    maxStock: "",
  });
  const [tempFilters, setTempFilters] = useState({
    category: [],
    minPrice: "",
    maxPrice: "",
    minStock: "",
    maxStock: "",
  });

  const navigate = useNavigate();

  // --- Fungsi untuk mengambil data produk dari API ---
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMyProducts();

      if (response && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "Gagal memuat data produk.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- Handler aksi untuk navigasi ---
  const handleView = (productId) => {
    navigate(`/dashboard/products/view/${productId}`);
  };

  const handleEdit = (productId) => {
    navigate(`/dashboard/products/edit/${productId}`);
  };

  const handleAddNew = () => {
    navigate("/dashboard/products/create");
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setProductToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    setDeleting(true);
    setError("");
    try {
      await deleteProduct(productToDelete.id);

      // Refresh data produk setelah berhasil menghapus data
      fetchProducts();
      closeDeleteModal();
    } catch (err) {
      setError(err.message || "Gagal menghapus produk.");
    } finally {
      setDeleting(false);
    }
  };

  // Fungsi filter untuk kategori produk
  const getFilterOptions = () => {
    const categories = [
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ];
    return {
      category: categories.map((cat) => ({ label: cat, value: cat })),
    };
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedFilters.category.length === 0 ||
      selectedFilters.category.includes(product.category);

    // filter harga
    const minPrice = parseFloat(selectedFilters.minPrice);
    const maxPrice = parseFloat(selectedFilters.maxPrice);
    const productPrice = parseFloat(product.price);

    const matchesPrice =
      (isNaN(minPrice) || productPrice >= minPrice) &&
      (isNaN(maxPrice) || productPrice <= maxPrice);

    // filter stok
    const minStock = parseInt(selectedFilters.minStock);
    const maxStock = parseInt(selectedFilters.maxStock);
    const productStock = parseInt(product.available_stock);

    const matchesStock =
      (isNaN(minStock) || productStock >= minStock) &&
      (isNaN(maxStock) || productStock <= maxStock);

    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  // Fungsi format harga
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Handler filter
  const handleFilterToggle = (category, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };
  const handleApplyFilters = () => {
    console.log("Apply Filter Clicked!");
    setSelectedFilters(tempFilters);
    setFilterModalOpen(false);
  };
  // Handler untuk input range (harga & stok)
  const handleRangeInputChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update handleResetFilters
  const handleResetFilters = () => {
    const emptyFilters = {
      category: [],
      minPrice: "",
      maxPrice: "",
      minStock: "",
      maxStock: "",
    };
    setTempFilters(emptyFilters);
    setSelectedFilters(emptyFilters);
    setFilterModalOpen(false);
  };
  const handleOpenFilterModal = () => {
    setTempFilters(selectedFilters);
    setFilterModalOpen(true);
  };
  const activeFilterCount =
    selectedFilters.category.length +
    (selectedFilters.minPrice || selectedFilters.maxPrice ? 1 : 0) +
    (selectedFilters.minStock || selectedFilters.maxStock ? 1 : 0);

  if (loading) {
    return <LoadingSkeleton />;
  }

  const filterOptions = getFilterOptions();

  return (
    <div className="p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 p-4 mb-4 bg-white rounded-lg shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl text-main">
            Daftar Produk
          </h1>
          <p className="text-sm text-main_text sm:text-base">
            Kelola data produk Anda
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg shadow-lg sm:px-6 sm:py-3 bg-main hover:bg-green-600 hover:shadow-xl sm:text-base sm:w-auto"
        >
          <MdAdd size={20} />
          <span className="sm:inline">Tambah Produk</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-6 border-l-4 rounded-r-lg bg-red-50 border-danger">
          <span className="text-sm font-medium text-danger sm:text-base">
            {error}
          </span>
        </div>
      )}

      {/* Search and Filter */}
      <div className="p-4 mb-4 bg-white border border-gray-100 rounded-lg shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <MdSearch
              className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari nama atau kategori produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg sm:py-3 focus:ring-2 focus:ring-main focus:border-transparent sm:text-base"
            />
          </div>
          <div className="relative">
            <button
              onClick={handleOpenFilterModal}
              className="relative flex items-center justify-center w-full gap-2 px-3 py-2 text-sm transition-colors border border-gray-300 rounded-lg sm:px-4 sm:py-3 hover:bg-gray-50 sm:text-base sm:w-auto"
            >
              <MdFilterList size={20} className="text-gray-600" />
              <span className="text-gray-700">Filter</span>
              {activeFilterCount > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white rounded-full -top-2 -right-2 bg-main">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TAMPILAN FILTER AKTIF */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedFilters.category.map((filterValue) => {
              const option = filterOptions.category.find(
                (opt) => opt.value === filterValue
              );
              const label = option ? option.label : filterValue;
              return (
                <span
                  key={filterValue}
                  className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-main bg-opacity-10 text-main sm:text-sm"
                >
                  Kategori: {label}
                  <button
                    onClick={() => {
                      const newFilters = selectedFilters.category.filter(
                        (item) => item !== filterValue
                      );
                      setSelectedFilters((prev) => ({
                        ...prev,
                        category: newFilters,
                      }));
                    }}
                    className="p-0.5 rounded-full hover:bg-main hover:bg-opacity-20"
                  >
                    <MdClose size={14} />
                  </button>
                </span>
              );
            })}

            {/* Filter Rentang Harga */}
            {(selectedFilters.minPrice || selectedFilters.maxPrice) && (
              <span className="flex items-center gap-1 px-3 py-1 text-xs text-indigo-800 bg-indigo-100 rounded-full sm:text-sm">
                Harga:{" "}
                {selectedFilters.minPrice
                  ? `min ${formatRupiah(selectedFilters.minPrice)}`
                  : ""}
                {selectedFilters.minPrice && selectedFilters.maxPrice
                  ? " - "
                  : ""}
                {selectedFilters.maxPrice
                  ? `maks ${formatRupiah(selectedFilters.maxPrice)}`
                  : ""}
                <button
                  onClick={() => {
                    setSelectedFilters((prev) => ({
                      ...prev,
                      minPrice: "",
                      maxPrice: "",
                    }));
                  }}
                  className="p-0.5 rounded-full hover:bg-indigo-200"
                >
                  <MdClose size={14} />
                </button>
              </span>
            )}

            {/* Filter Rentang Stok */}
            {(selectedFilters.minStock || selectedFilters.maxStock) && (
              <span className="flex items-center gap-1 px-3 py-1 text-xs text-purple-800 bg-purple-100 rounded-full sm:text-sm">
                Stok:{" "}
                {selectedFilters.minStock
                  ? `min ${selectedFilters.minStock}`
                  : ""}
                {selectedFilters.minStock && selectedFilters.maxStock
                  ? " - "
                  : ""}
                {selectedFilters.maxStock
                  ? `maks ${selectedFilters.maxStock}`
                  : ""}{" "}
                Kg
                <button
                  onClick={() => {
                    setSelectedFilters((prev) => ({
                      ...prev,
                      minStock: "",
                      maxStock: "",
                    }));
                  }}
                  className="p-0.5 rounded-full hover:bg-purple-200"
                >
                  <MdClose size={14} />
                </button>
              </span>
            )}

            {/* Tombol Hapus Semua Filter */}
            <button
              onClick={handleResetFilters}
              className="px-2 py-1 text-xs text-gray-500 underline hover:text-gray-700 sm:text-sm"
            >
              Hapus Semua Filter
            </button>
          </div>
        )}

        {/* TAMPILAN AKHIR FILTER AKTIF */}
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white rounded-lg shadow-lg">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-4">
              <MdWork size={64} className="mx-auto text-gray-300" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {products.length === 0
                ? "Belum Ada Produk"
                : "Produk Tidak Ditemukan"}
            </h3>
            <p className="mb-4 text-sm text-gray-500 sm:text-base">
              {products.length === 0
                ? "Mulai tambahkan produk untuk ditampilkan di sini."
                : "Coba ubah kriteria pencarian atau filter Anda."}
            </p>
            {products.length === 0 && (
              <button
                onClick={handleAddNew}
                className="px-6 py-3 font-medium text-white transition-colors rounded-lg bg-main hover:bg-green-600"
              >
                Tambah Produk Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-3 py-3 text-sm font-semibold text-left text-gray-900 sm:px-6 sm:py-4 sm:text-base">
                    No
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold text-left text-gray-900 sm:px-6 sm:py-4 sm:text-base min-w-[250px]">
                    Nama Produk
                  </th>
                  <th className="hidden px-3 py-3 text-sm font-semibold text-left text-gray-900 sm:px-6 sm:py-4 sm:text-base sm:table-cell">
                    Kategori
                  </th>
                  <th className="hidden px-3 py-3 text-sm font-semibold text-left text-gray-900 sm:px-6 sm:py-4 sm:text-base sm:table-cell">
                    Harga
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold text-left text-gray-900 sm:px-6 sm:py-4 sm:text-base">
                    Stok
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold text-center text-gray-900 sm:px-6 sm:py-4 sm:text-base min-w-[120px]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className="transition-colors border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-3 py-3 text-sm sm:px-6 sm:py-4 text-main_text sm:text-base">
                      {index + 1}
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            (product.image_urls && product.image_urls[0]) ||
                            "https://via.placeholder.com/150"
                          }
                          alt={product.title}
                          className="hidden object-cover w-12 h-12 rounded-md sm:block"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 break-words sm:text-base">
                            {product.title}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-3 py-3 text-sm sm:px-6 sm:py-4 text-main_text sm:text-base sm:table-cell">
                      {product.category}
                    </td>
                    <td className="hidden px-3 py-3 text-sm font-semibold sm:px-6 sm:py-4 text-main_text sm:text-base sm:table-cell">
                      {formatRupiah(product.price)}
                    </td>
                    <td className="px-3 py-3 text-sm sm:px-6 sm:py-4 text-main_text sm:text-base">
                      {product.available_stock} Kg
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4">
                      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleView(product.id)}
                          className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-100"
                          title="Lihat Detail"
                        >
                          <MdVisibility
                            size={16}
                            className="sm:w-[18px] sm:h-[18px]"
                          />
                        </button>
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="p-2 text-yellow-600 transition-colors rounded-lg hover:bg-yellow-100"
                          title="Edit Produk"
                        >
                          <MdEdit
                            size={16}
                            className="sm:w-[18px] sm:h-[18px]"
                          />
                        </button>
                        <button
                          onClick={() => openDeleteModal(product)}
                          className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-100"
                          title="Hapus Produk"
                        >
                          <MdDelete
                            size={16}
                            className="sm:w-[18px] sm:h-[18px]"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/*  MODAL KONFIRMASI HAPUS */}
      {deleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Konfirmasi Hapus Produk
            </h3>
            <p className="mb-6 text-gray-600">
              Apakah Anda yakin ingin menghapus produk{" "}
              <strong>"{productToDelete.title}"</strong>? Tindakan ini tidak
              dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg bg-danger hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                    Menghapus...
                  </>
                ) : (
                  <>
                    <MdDelete size={16} />
                    Hapus
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL AKHIR KONFIRMASI HAPUS */}

      {/* MODAL FILTER */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Filter Produk
              </h3>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose size={24} />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto sm:p-6">
              {/* Category Filter */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-900 sm:text-base">
                  Kategori Produk
                </h4>
                {filterOptions.category.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {filterOptions.category.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={tempFilters.category.includes(option.value)}
                          onChange={() =>
                            handleFilterToggle("category", option.value)
                          }
                          className="w-4 h-4 border-gray-300 rounded text-main focus:ring-main"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Tidak ada kategori tersedia untuk difilter.
                  </p>
                )}
              </div>

              {/* Rentang Harga Filter */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-900 sm:text-base">
                  Rentang Harga (Rp)
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="minPrice"
                      className="block mb-1 text-xs text-gray-500"
                    >
                      Minimum
                    </label>
                    <input
                      type="number"
                      id="minPrice"
                      name="minPrice"
                      min="0"
                      value={tempFilters.minPrice}
                      onChange={handleRangeInputChange}
                      placeholder="Rp 0"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-main focus:border-main"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="maxPrice"
                      className="block mb-1 text-xs text-gray-500"
                    >
                      Maksimum
                    </label>
                    <input
                      type="number"
                      id="maxPrice"
                      name="maxPrice"
                      min="0"
                      value={tempFilters.maxPrice}
                      onChange={handleRangeInputChange}
                      placeholder="Rp -"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-main focus:border-main"
                    />
                  </div>
                </div>
              </div>

              {/* Rentang Stok Filter */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-900 sm:text-base">
                  Rentang Stok (Kg)
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="minStock"
                      className="block mb-1 text-xs text-gray-500"
                    >
                      Minimum
                    </label>
                    <input
                      type="number"
                      id="minStock"
                      name="minStock"
                      min="0"
                      value={tempFilters.minStock}
                      onChange={handleRangeInputChange}
                      placeholder="0 Kg"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-main focus:border-main"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="maxStock"
                      className="block mb-1 text-xs text-gray-500"
                    >
                      Maksimum
                    </label>
                    <input
                      type="number"
                      id="maxStock"
                      name="maxStock"
                      min="0"
                      value={tempFilters.maxStock}
                      onChange={handleRangeInputChange}
                      placeholder="- Kg"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-main focus:border-main"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col gap-3 p-4 border-t border-gray-200 sm:flex-row sm:justify-end sm:p-6">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-sm text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 sm:text-base"
              >
                Reset
              </button>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 sm:text-base"
              >
                Batal
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white transition-colors rounded-lg bg-main hover:bg-green-600 sm:text-base"
              >
                <MdCheck size={16} />
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
      {/* AKHIR MODAL FILTER */}
    </div>
  );
};

export default ProductListPage;
