import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdLocalShipping,
  MdPerson,
  MdLocationOn,
  MdEvent,
  MdPhone,
  MdQrCode,
  MdErrorOutline,
  MdCheckCircle,
} from "react-icons/md";
import { FaCircle } from "react-icons/fa";
import Logo from "../../../../assets/images/Logo.png";
import AgrolinkText from "../../../../assets/images/agrolink.png";

// --- DUMMY DATA & SERVICE ---
const dummyOrders = [
  {
    id: "ORD-001",
    order_date: "2025-10-20T10:30:00Z",
    customer_name: "Budi Santoso",
    status: "dikemas",
    shipping_address: "Jl. Merdeka No. 1, Jakarta Pusat, DKI Jakarta, 10110",
    phone: "081234567890",
    shipping_method: "JNE REG (2-3 Hari)",
    tracking_number: null,
    items: [
      {
        id: "P-00A",
        name: "Kopi Arabika",
        image_url:
          "https://images.tokopedia.net/img/cache/700/VqbcmM/2021/8/28/9ee8a379-336c-4235-8664-0e3c1b01690F.jpg",
        price: 75000,
        quantity: 2,
        satuan: "kg",
      },
    ],
    subtotal: 150000, // (75000 * 2)
    ppn_amount: 16500, // (150000 * 0.11)
    total_amount: 166500, // (150000 + 16500)
  },
  {
    id: "ORD-002",
    order_date: "2025-10-21T11:00:00Z",
    customer_name: "Citra Lestari",
    status: "dikirim",
    shipping_address: "Jl. Sudirman No. 2, Bandung, Jawa Barat, 40112",
    phone: "081298765432",
    shipping_method: "SiCepat Express",
    tracking_number: "SC-987654321",
    items: [
      {
        id: "P-00B",
        name: "Salak Bali",
        image_url:
          "https://res.cloudinary.com/dk0z4ums3/image/upload/v1716795004/attached_image/salak-bali-inilah-nutrisi-dan-manfaatnya-bagi-kesehatan.jpg",
        price: 75000,
        quantity: 1,
        satuan: "kg",
      },
    ],
    subtotal: 75000,
    ppn_amount: 8250, // (75000 * 0.11)
    total_amount: 83250, // (75000 + 8250)
  },
];

const getOrderById = async (orderId) => {
  console.log("Mencari pesanan dengan ID:", orderId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const order = dummyOrders.find((o) => o.id === orderId);
  if (order) {
    return { data: order, status: "success" };
  } else {
    throw new Error("Pesanan tidak ditemukan");
  }
};
// --- END DUMMY ---

// --- Skeleton Components ---
const SkeletonLine = ({ width = "w-full", height = "h-4", className = "" }) => (
  <div
    className={`bg-gray-200 rounded animate-pulse ${width} ${height} ${className}`}
  ></div>
);

const OrderDetailSkeleton = () => (
  <div className="p-2 sm:p-4 animate-pulse">
    {/* Header */}
    <div className="flex items-center mb-6">
      <div className="w-8 h-8 mr-4 bg-gray-200 rounded-full"></div>
      <SkeletonLine width="w-48" height="h-8" />
    </div>

    {/* Nota Skeleton */}
    <div className="max-w-4xl p-4 mx-auto bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-10">
      {/* Nota Header */}
      <div className="flex flex-col items-start justify-between pb-6 border-b sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          <SkeletonLine width="w-24" height="h-6" />
        </div>
        <div className="mt-4 text-left sm:mt-0 sm:text-right">
          <SkeletonLine width="w-24" height="h-7" className="mb-2" />
          <SkeletonLine width="w-32" height="h-5" />
        </div>
      </div>
      {/* Nota Info */}
      <div className="grid grid-cols-1 gap-6 py-6 border-b md:grid-cols-2">
        <div className="space-y-4">
          <SkeletonLine width="w-32" height="h-5" className="mb-3" />
          <SkeletonLine width="w-40" height="h-4" />
          <SkeletonLine width="w-full" height="h-4" />
          <SkeletonLine width="w-32" height="h-4" />
        </div>
        <div className="space-y-4">
          <SkeletonLine width="w-24" height="h-5" className="mb-3" />
          <SkeletonLine width="w-48" height="h-4" />
          <SkeletonLine width="w-36" height="h-4" />
        </div>
      </div>
      {/* Nota Table Skeleton */}
      <div className="py-6">
        <div className="flex justify-between py-3 border-b">
          <SkeletonLine width="w-1/2" height="h-4" />
          <SkeletonLine width="w-1/4" height="h-4" />
        </div>
        <div className="flex justify-between py-3 border-b">
          <SkeletonLine width="w-2/3" height="h-4" />
          <SkeletonLine width="w-1/5" height="h-4" />
        </div>
      </div>
      {/* Nota Summary Skeleton */}
      <div className="w-full pt-6 pb-2 space-y-3 border-t sm:ml-auto sm:max-w-xs sm:pl-12">
        <div className="flex justify-between">
          <SkeletonLine width="w-20" height="h-4" />
          <SkeletonLine width="w-24" height="h-4" />
        </div>
        <div className="flex justify-between">
          <SkeletonLine width="w-24" height="h-4" />
          <SkeletonLine width="w-20" height="h-4" />
        </div>
        <div className="flex justify-between">
          <SkeletonLine width="w-16" height="h-6" />
          <SkeletonLine width="w-28" height="h-6" />
        </div>
      </div>
    </div>
  </div>
);
// --- End Skeleton Components ---

// --- Helper Components ---
const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    dikemas: { label: "Dikemas", className: "bg-yellow-100 text-yellow-800" },
    dikirim: { label: "Dikirim", className: "bg-blue-100 text-blue-800" },
    selesai: { label: "Selesai", className: "bg-green-100 text-green-800" },
    dibatalkan: { label: "Dibatalkan", className: "bg-red-100 text-red-800" },
  };
  const config = statusConfig[status] || {
    label: status,
    className: "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${config.className}`}
    >
      {config.label}
    </span>
  );
};
// --- End Helper Components ---

// --- Helper Functions ---
const formatRupiah = (number) => {
  if (number === null || number === undefined) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    return (
      new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(dateString)) + " WIB"
    );
  } catch (e) {
    return "Invalid Date";
  }
};
// --- End Helper Functions ---

// --- MAIN COMPONENT ---
const OrderDetailPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) {
      setError("ID Pesanan tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getOrderById(orderId);
        if (response && response.data) {
          setOrder(response.data);
        } else {
          throw new Error("Format data pesanan tidak valid.");
        }
      } catch (err) {
        setError(err.message || "Gagal mengambil detail detail pesanan.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <OrderDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="max-w-md p-6 text-center border-l-4 border-red-500 rounded-r-lg shadow-md bg-red-50">
          <MdErrorOutline size={48} className="mx-auto text-red-500" />
          <h3 className="mt-4 mb-2 text-lg font-bold text-red-800">
            Terjadi Kesalahan
          </h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 mt-6 font-medium text-white transition-colors rounded-md bg-main hover:bg-green-700"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const subtotal =
    order.subtotal ||
    order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const ppnAmount =
    order.ppn_amount !== undefined ? order.ppn_amount : subtotal * 0.11;
  const totalAmount = order.total_amount || subtotal + ppnAmount;

  return (
    <div className="w-full max-w-[100vw] p-2 bg-gray-50 sm:p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center max-w-4xl mx-auto mb-6">
        <button
          onClick={handleBack}
          className="p-2 mr-2 text-gray-600 transition-colors rounded-full hover:text-gray-800 hover:bg-gray-100"
        >
          <MdArrowBack size={24} />
        </button>
        <h1 className="text-xl font-bold sm:text-2xl text-main">
          Detail Pesanan
        </h1>
      </div>

      {/* Nota/Invoice Body */}
      <div className="max-w-4xl p-4 mx-auto bg-white border border-gray-200 rounded-lg shadow-lg sm:p-6 md:p-10">
        {/* Nota Header */}
        <div className="flex flex-col items-start justify-between pb-6 border-b border-gray-200 sm:flex-row">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <img src={Logo} alt="AgroLink Logo" className="h-14 w-14" />
            <div>
              <img src={AgrolinkText} alt="AgroLink" className="h-5" />
              <p className="text-xs text-gray-500">
                Jl. Udayana No. 1, Bali, Indonesia
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <h2 className="text-2xl font-bold text-gray-700 uppercase">
              INVOICE
            </h2>
            <p className="font-mono text-sm text-gray-500">{order.id}</p>
          </div>
        </div>

        {/* Customer & Order Info */}
        <div className="grid grid-cols-1 gap-6 py-6 border-b border-gray-200 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase">
              Ditagih Kepada
            </h3>
            <p className="text-lg font-semibold text-gray-800">
              {order.customer_name}
            </p>
            <p className="text-gray-600">{order.shipping_address}</p>
            <p className="text-gray-600">{order.phone}</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between md:justify-start md:gap-4">
              <span className="text-sm font-semibold text-gray-500 md:w-32">
                Status Pesanan:
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="flex justify-between md:justify-start md:gap-4">
              <span className="text-sm font-semibold text-gray-500 md:w-32">
                Tanggal Pesan:
              </span>
              <span className="font-medium text-gray-800">
                {formatDate(order.order_date)}
              </span>
            </div>
            <div className="flex justify-between md:justify-start md:gap-4">
              <span className="text-sm font-semibold text-gray-500 md:w-32">
                Pengiriman:
              </span>
              <span className="font-medium text-gray-800">
                {order.shipping_method}
              </span>
            </div>
            {order.tracking_number && (
              <div className="flex justify-between md:justify-start md:gap-4">
                <span className="text-sm font-semibold text-gray-500 md:w-32">
                  No. Resi:
                </span>
                <span className="font-medium text-blue-600">
                  {order.tracking_number}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="py-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase">
            Rincian Pesanan
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="hidden border-b border-gray-200 sm:table-header-group">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-left text-gray-600 uppercase">
                    Produk
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-center text-gray-600 uppercase">
                    Jumlah
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-right text-gray-600 uppercase">
                    Harga Satuan
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-right text-gray-600 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 sm:divide-y-0">
                {order.items.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="block py-4 sm:table-row sm:py-0 sm:border-b sm:border-gray-100"
                  >
                    <td className="px-4 py-1 sm:py-4 sm:table-cell">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            item.image_url ||
                            "https://placehold.co/100x100/e2e8f0/e2e8f0"
                          }
                          alt={item.name}
                          className="hidden object-cover w-10 h-10 rounded-md sm:block"
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/100x100/e2e8f0/e2e8f0";
                          }}
                        />
                        <span className="text-base font-medium text-gray-800 sm:text-sm">
                          {item.name}
                        </span>
                        <div className="text-sm text-gray-600 sm:hidden">
                          {item.quantity} {item.satuan || "pcs"} x{" "}
                          {formatRupiah(item.price)}
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-4 text-center text-gray-600 sm:table-cell">
                      {item.quantity}
                    </td>
                    <td className="hidden px-4 py-4 font-medium text-right text-gray-600 sm:table-cell">
                      {formatRupiah(item.price)}
                    </td>
                    <td className="px-4 pt-2 pb-1 text-right sm:px-4 sm:py-4 sm:table-cell">
                      <span className="text-base font-bold text-gray-900 sm:text-sm sm:font-semibold sm:text-gray-800">
                        {formatRupiah(item.price * item.quantity)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Nota Summary */}
        <div className="w-full pt-6 pb-2 mt-4 space-y-2.5 border-t border-gray-200 sm:max-w-xs sm:ml-auto sm:pl-12">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium text-gray-800">
              {formatRupiah(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>PPN (11%)</span>
            <span className="font-medium text-gray-800">
              {formatRupiah(ppnAmount)}
            </span>
          </div>

          <div className="flex justify-between pt-2 mt-2 text-xl font-bold text-gray-900 border-t border-gray-300">
            <span>Total</span>
            <span>{formatRupiah(totalAmount)}</span>
          </div>
        </div>

        {/* Nota Footer */}
        <div className="pt-6 mt-6 text-xs text-center text-gray-500 border-t border-gray-200">
          <p>Terima kasih telah berbelanja di AgroLink!</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
