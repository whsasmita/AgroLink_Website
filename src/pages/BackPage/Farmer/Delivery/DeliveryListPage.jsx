import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdVisibility,
  MdFilterList,
  MdSearch,
  MdClose,
  MdCheck,
  MdLocalShipping,
  MdReceipt,
  MdPayments,
  MdAdd,
} from "react-icons/md";
import { getMyDelivery } from "../../../../services/deliveryService";
import { initiatePayment } from "../../../../services/paymentService";
import { TbTruckDelivery } from "react-icons/tb";

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
    <td className="px-3 sm:px-6 py-4">
      <SkeletonLine width="w-6" height="h-4" />
    </td>
    <td className="px-3 sm:px-6 py-4">
      <SkeletonLine width="w-32" height="h-5" />
    </td>
    <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
      <SkeletonLine width="w-24" height="h-4" />
    </td>
    <td className="px-3 sm:px-6 py-4">
      <SkeletonLine width="w-20" height="h-4" />
    </td>
    <td className="px-3 sm:px-6 py-4">
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </td>
  </tr>
);

const LoadingSkeleton = () => (
  <div className="p-2 sm:p-4">
    {/* Header Skeleton */}
    <div className="flex flex-col sm:flex-row bg-white rounded-lg shadow-sm p-4 justify-between items-start sm:items-center mb-4 gap-4">
      <div>
        <SkeletonLine width="w-48" height="h-8" />
        <div className="mt-2">
          <SkeletonLine width="w-64" height="h-4" />
        </div>
      </div>
    </div>

    {/* Search and Filter Skeleton */}
    <div className="mb-4 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SkeletonBox width="w-full" height="h-12" />
        </div>
        <SkeletonBox width="w-20" height="h-12" />
      </div>
    </div>

    {/* Table Skeleton */}
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-3 sm:px-6 py-4">
                <SkeletonLine width="w-8" height="h-4" />
              </th>
              <th className="text-left px-3 sm:px-6 py-4">
                <SkeletonLine width="w-24" height="h-4" />
              </th>
              <th className="text-left px-3 sm:px-6 py-4 hidden sm:table-cell">
                <SkeletonLine width="w-28" height="h-4" />
              </th>
              <th className="text-left px-3 sm:px-6 py-4">
                <SkeletonLine width="w-20" height="h-4" />
              </th>
              <th className="text-center px-3 sm:px-6 py-4">
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

const DeliveryListPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    status: [],
  });
  const [tempFilters, setTempFilters] = useState({
    status: [],
  });

  const navigate = useNavigate();

  const handleSearchExpedition = (deliveryId) => {
    navigate(`/dashboard/delivery-list/find-drivers/${deliveryId}`);
  };

  // Fetch deliveries data
  const fetchDeliveries = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMyDelivery();
      if (response.data && Array.isArray(response.data)) {
        setDeliveries(response.data);
      } else {
        setDeliveries([]);
      }
    } catch (err) {
      console.error("Error fetching deliveries:", err);
      setError("Gagal memuat data pengiriman.");
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  // Handler for payment
  const handlePayment = async (deliveryId, invoiceId) => {
    setError("");
    try {
      const result = await initiatePayment(invoiceId, deliveryId);

      if (result && result.data && result.data.redirect_url) {
        window.location.href = result.data.redirect_url;
      } else {
        setError("URL pembayaran tidak ditemukan. Silakan hubungi admin.");
        console.error(
          "Initiate payment response did not contain a redirect URL:",
          result
        );
      }
    } catch (err) {
      console.error("Error initiating payment:", err);
      setError(err.message || "Gagal memulai pembayaran. Silakan coba lagi.");
    }
  };

  // Get filter options
  const getFilterOptions = () => {
    const statuses = [
      ...new Set(
        deliveries.map((delivery) => delivery.delivery_status).filter(Boolean)
      ),
    ];

    return {
      status: statuses.map((status) => ({
        label:
          status === "pending"
            ? "Menunggu"
            : status === "finding_driver"
            ? "Mencari Driver"
            : status === "driver_assigned"
            ? "Driver Ditugaskan"
            : status === "picked_up"
            ? "Telah Diambil"
            : status === "in_transit"
            ? "Dalam Perjalanan"
            : status === "delivered"
            ? "Terkirim"
            : status === "cancelled"
            ? "Dibatalkan"
            : status === "waiting_payment"
            ? "Menunggu Pembayaran"
            : status || "Tidak Ditentukan",
        value: status || "",
      })),
    };
  };

  // Filter deliveries based on search and filter criteria
  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.pickup_address
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      delivery.delivery_address
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      delivery.delivery_id?.toString().includes(searchTerm);

    const matchesStatus =
      selectedFilters.status.length === 0 ||
      selectedFilters.status.includes(delivery.delivery_status);

    return matchesSearch && matchesStatus;
  });

  // Filter handlers
  const handleFilterToggle = (category, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const handleApplyFilters = () => {
    setSelectedFilters(tempFilters);
    setFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      status: [],
    };
    setTempFilters(emptyFilters);
    setSelectedFilters(emptyFilters);
  };

  const handleOpenFilterModal = () => {
    setTempFilters(selectedFilters);
    setFilterModalOpen(true);
  };

  // Get active filter count
  const activeFilterCount = Object.values(selectedFilters).reduce(
    (sum, filters) => sum + filters.length,
    0
  );

  // Action handlers
//   const handleView = (deliveryId) => {
//     navigate(`/dashboard/delivery-list/view/${deliveryId}`);
//   };

  const handleAddNew = () => {
    navigate("/dashboard/delivery-list/create");
  };

  const handleSearchEkpedition = (e) => {
    setSearchTerm(e.target.value);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: "Menunggu",
        bgColor: "bg-gray-500",
        borderColor: "border-gray-200",
        hoverBg: "hover:bg-gray-50",
      },
      finding_driver: {
        label: "Mencari Driver",
        bgColor: "bg-blue-500",
        borderColor: "border-blue-200",
        hoverBg: "hover:bg-blue-50",
      },
      driver_assigned: {
        label: "Driver Ditugaskan",
        bgColor: "bg-purple-500",
        borderColor: "border-purple-200",
        hoverBg: "hover:bg-purple-50",
      },
      picked_up: {
        label: "Telah Diambil",
        bgColor: "bg-indigo-500",
        borderColor: "border-indigo-200",
        hoverBg: "hover:bg-indigo-50",
      },
      in_transit: {
        label: "Dalam Perjalanan",
        bgColor: "bg-yellow-500",
        borderColor: "border-yellow-200",
        hoverBg: "hover:bg-yellow-50",
      },
      delivered: {
        label: "Terkirim",
        bgColor: "bg-green-500",
        borderColor: "border-green-200",
        hoverBg: "hover:bg-green-50",
      },
      cancelled: {
        label: "Dibatalkan",
        bgColor: "bg-red-500",
        borderColor: "border-red-200",
        hoverBg: "hover:bg-red-50",
      },
      waiting_payment: {
        label: "Menunggu Pembayaran",
        bgColor: "bg-orange-500",
        borderColor: "border-orange-200",
        hoverBg: "hover:bg-orange-50",
      },
    };

    const config = statusConfig[status] || {
      label: status || "Tidak Diketahui",
      bgColor: "bg-gray-400",
      borderColor: "border-gray-200",
      hoverBg: "hover:bg-gray-50",
    };

    return (
      <div className="relative group inline-block">
        {/* Status Circle */}
        <div
          className={`w-4 h-4 rounded-full ${config.bgColor} border-2 ${config.borderColor} cursor-help transition-all duration-200 ${config.hoverBg}`}
          title={config.label}
        ></div>

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {config.label}
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  };

  // Show skeleton while loading
  if (loading) {
    return <LoadingSkeleton />;
  }

  const filterOptions = getFilterOptions();

  return (
    <div className="p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row bg-white rounded-lg shadow-sm p-4 justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-main mb-2">
            Daftar Pengiriman
          </h1>
          <p className="text-main_text text-sm sm:text-base">
            Kelola data pengiriman Anda
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-main hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <MdAdd size={20} />
          <span className="sm:inline">Tambah Pengiriman</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-danger p-4 rounded-r-lg">
          <span className="text-danger font-medium text-sm sm:text-base">
            {error}
          </span>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-4 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <MdSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari pengiriman..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent text-sm sm:text-base"
            />
          </div>

          {/* <div className="relative">
            <button
              onClick={handleOpenFilterModal}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <MdFilterList size={20} className="text-gray-600" />
              <span className="text-gray-700">Filter</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-main text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div> */}
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedFilters.status.map((filter) => {
              const statusLabel =
                filter === "pending"
                  ? "Menunggu"
                  : filter === "finding_driver"
                  ? "Mencari Driver"
                  : filter === "driver_assigned"
                  ? "Driver Ditugaskan"
                  : filter === "picked_up"
                  ? "Telah Diambil"
                  : filter === "in_transit"
                  ? "Dalam Perjalanan"
                  : filter === "delivered"
                  ? "Terkirim"
                  : filter === "cancelled"
                  ? "Dibatalkan"
                  : filter === "waiting_payment"
                  ? "Menunggu Pembayaran"
                  : filter || "Tidak Ditentukan";
              return (
                <span
                  key={filter}
                  className="bg-main bg-opacity-10 text-main px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1"
                >
                  Status: {statusLabel}
                  <button
                    onClick={() => handleFilterToggle("status", filter)}
                    className="hover:bg-main hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <MdClose size={14} />
                  </button>
                </span>
              );
            })}
            <button
              onClick={handleResetFilters}
              className="text-gray-500 hover:text-gray-700 px-2 py-1 text-xs sm:text-sm underline"
            >
              Hapus Semua
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {filteredDeliveries.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-4">
              <MdLocalShipping size={64} className="text-gray-300 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {deliveries.length === 0
                ? "Belum Ada Pengiriman"
                : "Tidak Ada Data yang Sesuai"}
            </h3>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">
              {deliveries.length === 0
                ? "Belum ada data pengiriman."
                : "Coba ubah kriteria pencarian atau filter Anda."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base">
                    No
                  </th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base min-w-[200px]">
                    Deskripsi Barang
                  </th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base min-w-[200px] hidden sm:table-cell">
                    Alamat Tujuan
                  </th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base">
                    Status
                  </th>
                  <th className="text-center px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base min-w-[120px]">
                    Aksi
                  </th>
                  <th className="text-center px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base min-w-[120px]">
                    Pembayaran
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map((delivery, index) => (
                  <tr
                    key={delivery.delivery_id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-main_text text-sm sm:text-base">
                      {index + 1}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm sm:text-base break-words">
                          {delivery.item_description || "-"}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-main_text text-sm sm:text-base hidden sm:table-cell">
                      <p className="break-words">
                        {delivery.destination_address || "-"}
                      </p>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex justify-start">
                        {getStatusBadge(delivery.status)}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                        <button
                          onClick={() => handleSearchExpedition(delivery.delivery_id)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Temukan Ekspedisi"
                        >
                          <TbTruckDelivery
                            size={16}
                            className="sm:w-[18px] sm:h-[18px]"
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                      {delivery.delivery_status === "waiting_payment" ? (
                        <button
                          onClick={() =>
                            handlePayment(
                              delivery.delivery_id,
                              delivery.invoice_id
                            )
                          }
                          className="inline-flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium text-xs sm:text-sm whitespace-nowrap"
                          title="Bayar Sekarang"
                        >
                          <MdReceipt size={16} />
                          <span>Bayar Sekarang</span>
                        </button>
                      ) : delivery.delivery_status === "delivered" ? (
                        <div className="inline-flex items-center gap-1.5 text-green-600 bg-green-100 px-3 py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap">
                          <MdCheck size={16} />
                          <span>Sudah Dibayar</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-gray-500 bg-gray-100 px-3 py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap">
                          <MdPayments size={16} />
                          <span>Belum Perlu</span>
                        </div>
                      )}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Filter Pengiriman
              </h3>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Status Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">
                  Status Pengiriman
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filterOptions.status.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={tempFilters.status.includes(option.value)}
                        onChange={() =>
                          handleFilterToggle("status", option.value)
                        }
                        className="w-4 h-4 text-main border-gray-300 rounded focus:ring-main"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end p-4 sm:p-6 border-t border-gray-200">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Reset
              </button>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Batal
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-main hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2 justify-center text-sm sm:text-base"
              >
                <MdCheck size={16} />
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryListPage;
