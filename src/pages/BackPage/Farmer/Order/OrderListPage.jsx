import { useState, useEffect } from "react";
import {
  MdVisibility,
  MdFilterList,
  MdSearch,
  MdClose,
  MdCheck,
  MdHistory,
  MdErrorOutline,
  MdInfoOutline,
  MdArrowDropDown,
} from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// --- DUMMY DATA ---
const initialDummyOrders = [
  {
    id: "ORD-001",
    order_date: "2025-10-20T10:30:00Z",
    customer_name: "Budi Santoso",
    items: [{ product_name: "Produk A", quantity: 2 }],
    total_amount: 150000,
    status: "dikemas",
  },
  {
    id: "ORD-002",
    order_date: "2025-10-21T11:00:00Z",
    customer_name: "Citra Lestari",
    items: [{ product_name: "Produk B", quantity: 1 }],
    total_amount: 75000,
    status: "dikirim",
  },
  {
    id: "ORD-003",
    order_date: "2025-10-19T09:15:00Z",
    customer_name: "Andi Wijaya",
    items: [{ product_name: "Produk C", quantity: 3 }],
    total_amount: 225000,
    status: "selesai",
  },
  {
    id: "ORD-004",
    order_date: "2025-10-21T14:00:00Z",
    customer_name: "Dewi Anggraini",
    items: [{ product_name: "Produk D", quantity: 1 }],
    total_amount: 90000,
    status: "dikemas",
  },
  {
    id: "ORD-005",
    order_date: "2025-10-18T16:00:00Z",
    customer_name: "Eka Putra",
    items: [{ product_name: "Produk E", quantity: 5 }],
    total_amount: 300000,
    status: "selesai",
  },
];
// --- END DUMMY DATA ---

// --- Skeleton Components ---
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
      <SkeletonLine width="w-40" height="h-5" />
      <SkeletonLine width="w-32" height="h-4" className="mt-1" />
    </td>
    <td className="hidden px-3 py-4 sm:px-6 sm:table-cell">
      <SkeletonLine width="w-24" height="h-4" />
    </td>
    <td className="hidden px-3 py-4 text-right sm:px-6 sm:table-cell">
      <SkeletonLine width="w-20" height="h-4" />
    </td>
    <td className="px-3 py-4 text-center sm:px-6">
      <SkeletonLine width="w-24" height="h-6" />
    </td>
    <td className="px-3 py-4 sm:px-6">
      <div className="flex items-center justify-center gap-1 sm:gap-2">
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
                <SkeletonLine width="w-32" height="h-4" />
              </th>
              <th className="hidden px-3 py-4 text-left sm:px-6 sm:table-cell">
                <SkeletonLine width="w-24" height="h-4" />
              </th>
              <th className="hidden px-3 py-4 text-right sm:px-6 sm:table-cell">
                <SkeletonLine width="w-20" height="h-4" />
              </th>
              <th className="px-3 py-4 text-center sm:px-6">
                <SkeletonLine width="w-16" height="h-4" />
              </th>
              <th className="px-3 py-4 text-center sm:px-6">
                <SkeletonLine width="w-12" height="h-4" />
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
// --- End Skeleton Components ---

const orderStatusOptions = [
  { value: "dikemas", label: "Dikemas" },
  { value: "dikirim", label: "Dikirim" },
  { value: "selesai", label: "Selesai" },
  //   { value: 'dibatalkan', label: 'Dibatalkan' },
];

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    status: [],
    startDate: "",
    endDate: "",
  });
  const [tempFilters, setTempFilters] = useState({
    status: [],
    startDate: "",
    endDate: "",
  });
  const [updatingStatusOrderId, setUpdatingStatusOrderId] = useState(null);

  const navigate = useNavigate();

  // --- Fetch Order Data ---
  const fetchOrders = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      try {
        setOrders(initialDummyOrders);
      } catch (err) {
        console.error("Error setting dummy data:", err);
        setError("Gagal memuat data pesanan (dummy).");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- Action Handlers ---
  const handleViewOrderDetails = (orderId) => {
    navigate(`/dashboard/orders/view/${orderId}`);
    // alert(`View details for Order ID: ${orderId}`);
  };

  // --- Status Update Handler ---
  const handleStatusChange = (orderId, newStatus) => {
    setUpdatingStatusOrderId(orderId);
    setError("");
    setSuccess("");
    console.log(`Simulating status update for ${orderId} to ${newStatus}...`);

    setTimeout(() => {
      try {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        setSuccess(`Status pesanan #${orderId} berhasil diubah (dummy).`);
        console.log(`Dummy update successful for ${orderId}.`);
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError("Simulasi gagal mengubah status pesanan.");
        console.error("Dummy status update failed:", err);
      } finally {
        setUpdatingStatusOrderId(null);
      }
    }, 1000);
  };

  // --- Filter Logic ---
  const getFilterOptions = () => {
    const statuses = [
      ...new Set(orders.map((order) => order.status).filter(Boolean)),
    ];
    return {
      status: orderStatusOptions.filter((opt) => statuses.includes(opt.value)),
    };
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedFilters.status.length === 0 ||
      selectedFilters.status.includes(order.status);

    let matchesDate = true;
    if (
      order.order_date &&
      (selectedFilters.startDate || selectedFilters.endDate)
    ) {
      try {
        const orderDate = new Date(order.order_date);
        const startDate = selectedFilters.startDate
          ? new Date(selectedFilters.startDate)
          : null;
        const endDate = selectedFilters.endDate
          ? new Date(selectedFilters.endDate)
          : null;
        if (startDate) startDate.setHours(0, 0, 0, 0);
        if (endDate) endDate.setHours(23, 59, 59, 999);
        matchesDate =
          (!startDate || orderDate >= startDate) &&
          (!endDate || orderDate <= endDate);
      } catch (e) {
        matchesDate = true;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // --- Helper Functions ---
  const formatRupiah = (number) => {
    if (number === null || number === undefined) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(dateString));
    } catch (e) {
      return "Invalid Date";
    }
  };

  // --- Filter Handlers ---
  const handleFilterToggle = (category, value) => {
    if (category === "status") {
      setTempFilters((prev) => ({
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter((item) => item !== value)
          : [...prev[category], value],
      }));
    }
  };

  const handleDateInputChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    setSelectedFilters(tempFilters);
    setFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    const emptyFilters = { status: [], startDate: "", endDate: "" };
    setTempFilters(emptyFilters);
    setSelectedFilters(emptyFilters);
    setFilterModalOpen(false);
  };

  const handleOpenFilterModal = () => {
    setTempFilters(selectedFilters);
    setFilterModalOpen(true);
  };

  const activeFilterCount =
    selectedFilters.status.length +
    (selectedFilters.startDate ? 1 : 0) +
    (selectedFilters.endDate ? (selectedFilters.startDate ? 0 : 1) : 0);

  // --- Render ---
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
            Daftar Pesanan Masuk
          </h1>
          <p className="text-sm text-main_text sm:text-base">
            Kelola pesanan produk dari pelanggan
          </p>
        </div>
      </div>

      {/* Error & Success Messages */}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 text-sm text-red-700 border border-red-200 rounded-md bg-red-50">
          <MdErrorOutline size={18} /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-3 mb-4 text-sm text-green-700 border border-green-200 rounded-md bg-green-50">
          <MdCheck size={18} /> {success}
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
              placeholder="Cari ID Pesanan atau Nama Pelanggan..."
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

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedFilters.status.map((filterValue) => {
              const option = filterOptions.status.find(
                (opt) => opt.value === filterValue
              );
              const label = option ? option.label : filterValue;
              return (
                <span
                  key={filterValue}
                  className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-main bg-opacity-10 text-main sm:text-sm"
                >
                  Status: {label}
                  <button
                    onClick={() => {
                      const newFilters = selectedFilters.status.filter(
                        (item) => item !== filterValue
                      );
                      setSelectedFilters((prev) => ({
                        ...prev,
                        status: newFilters,
                      }));
                    }}
                    className="p-0.5 rounded-full hover:bg-main hover:bg-opacity-20"
                  >
                    <MdClose size={14} />
                  </button>
                </span>
              );
            })}
            {(selectedFilters.startDate || selectedFilters.endDate) && (
              <span className="flex items-center gap-1 px-3 py-1 text-xs text-indigo-800 bg-indigo-100 rounded-full sm:text-sm">
                Tanggal:{" "}
                {selectedFilters.startDate
                  ? formatDate(selectedFilters.startDate)
                  : "..."}
                {" - "}
                {selectedFilters.endDate
                  ? formatDate(selectedFilters.endDate)
                  : "..."}
                <button
                  onClick={() => {
                    setSelectedFilters((prev) => ({
                      ...prev,
                      startDate: "",
                      endDate: "",
                    }));
                  }}
                  className="p-0.5 rounded-full hover:bg-indigo-200"
                >
                  <MdClose size={14} />
                </button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="px-2 py-1 text-xs text-gray-500 underline hover:text-gray-700 sm:text-sm"
            >
              Hapus Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden bg-white rounded-lg shadow-lg">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-4">
              <MdHistory size={64} className="mx-auto text-gray-300" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {orders.length === 0
                ? "Belum Ada Pesanan Masuk"
                : "Pesanan Tidak Ditemukan"}
            </h3>
            <p className="mb-4 text-sm text-gray-500 sm:text-base">
              {orders.length === 0
                ? "Pesanan dari pelanggan akan muncul di sini."
                : "Coba ubah kriteria pencarian atau filter Anda."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-3 py-3 text-sm font-semibold text-left text-gray-900 sm:px-6 sm:py-4 sm:text-base">
                    No
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold text-left text-gray-900 sm:px-6 sm:py-4 sm:text-base min-w-[200px]">
                    Info Pesanan
                  </th>
                  <th className="hidden px-3 py-3 text-sm font-semibold text-left text-gray-900 sm:px-6 sm:py-4 sm:text-base sm:table-cell">
                    Tanggal
                  </th>
                  <th className="hidden px-3 py-3 text-sm font-semibold text-right text-gray-900 sm:px-6 sm:py-4 sm:text-base sm:table-cell">
                    Total
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold text-center text-gray-900 sm:px-6 sm:py-4 sm:text-base min-w-[150px]">
                    Status
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold text-center text-gray-900 sm:px-6 sm:py-4 sm:text-base min-w-[100px]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="transition-colors border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-3 py-3 text-sm sm:px-6 sm:py-4 text-main_text sm:text-base">
                      {index + 1}
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 break-words sm:text-base">
                          {order.id}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.customer_name || "Tanpa Nama"}
                        </p>
                      </div>
                    </td>
                    <td className="hidden px-3 py-3 text-sm sm:px-6 sm:py-4 text-main_text sm:text-base sm:table-cell">
                      {formatDate(order.order_date)}
                    </td>
                    <td className="hidden px-3 py-3 text-sm font-semibold text-right sm:px-6 sm:py-4 text-main_text sm:text-base sm:table-cell">
                      {formatRupiah(order.total_amount)}
                    </td>
                    <td className="px-3 py-3 text-center sm:px-6 sm:py-4">
                      {/* Status Dropdown */}
                      <div className="relative inline-block w-full max-w-[150px]">
                        {" "}
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          disabled={
                            ["selesai", "dibatalkan"].includes(order.status) ||
                            updatingStatusOrderId === order.id
                          }
                          className={`block w-full px-3 py-2 text-xs font-semibold border rounded-md shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent sm:text-sm transition-all duration-200 pr-8 ${
                            /* Tambah */ ""
                          }
                        ${
                          updatingStatusOrderId === order.id
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }
                        ${
                          // Styling Logic Based on Status
                          order.status === "dikemas"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : order.status === "dikirim"
                            ? "bg-blue-100 text-blue-800 border-blue-300"
                            : order.status === "selesai"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : order.status === "dibatalkan"
                            ? "bg-red-100 text-red-800 border-red-300"
                            : "bg-gray-100 text-gray-800 border-gray-300"
                        }`}
                        >
                          {orderStatusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          {updatingStatusOrderId === order.id ? (
                            <FaSpinner
                              className="text-gray-600 animate-spin"
                              size={14}
                            />
                          ) : (
                            <MdArrowDropDown
                              className={`w-5 h-5 ${
                                order.status === "dikemas"
                                  ? "text-yellow-700"
                                  : order.status === "dikirim"
                                  ? "text-blue-700"
                                  : order.status === "selesai"
                                  ? "text-green-700"
                                  : "text-gray-600"
                              }`}
                            />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4">
                      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleViewOrderDetails(order.id)}
                          className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-100"
                          title="Lihat Detail Pesanan"
                        >
                          <MdVisibility
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

      {/* Filter Modal */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Filter Pesanan
              </h3>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose size={24} />
              </button>
            </div>
            {/* Modal Content */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto sm:p-6">
              {/* Status Filter */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-900 sm:text-base">
                  Status Pesanan
                </h4>
                {filterOptions.status.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {filterOptions.status.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={tempFilters.status.includes(option.value)}
                          onChange={() =>
                            handleFilterToggle("status", option.value)
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
                    Tidak ada status tersedia.
                  </p>
                )}
              </div>
              {/* Date Range Filter */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-900 sm:text-base">
                  Rentang Tanggal Pesanan
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block mb-1 text-xs text-gray-500"
                    >
                      Dari Tanggal
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={tempFilters.startDate}
                      onChange={handleDateInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-main focus:border-main"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block mb-1 text-xs text-gray-500"
                    >
                      Sampai Tanggal
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={tempFilters.endDate}
                      onChange={handleDateInputChange}
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
                <MdCheck size={16} /> Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderListPage;
