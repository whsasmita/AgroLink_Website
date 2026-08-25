import { useState, useEffect, useCallback } from "react";
import {
  Handshake,
  Plus,
  Search,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  Building,
  User,
  Calendar,
  DollarSign,
  FileText,
  Eye,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import {
  getMyCooperations,
  getCooperationById,
  createCooperationOffer,
  approveCooperation,
  rejectCooperation,
  initiateCooperationPayment,
} from "../../../services/mitraService";
import { useAuth } from "../../../contexts/AuthContext";

// Format Currency IDR
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format Date Time
const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

const MitraCooperationPage = () => {
  const { user } = useAuth();
  const [cooperations, setCooperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [selectedCooperation, setSelectedCooperation] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [actionProcessing, setActionProcessing] = useState(false);

  // Form State for New Offer
  const [newOffer, setNewOffer] = useState({
    farmer_id: "",
    title: "",
    description: "",
    proposed_amount: "",
    start_date: "",
    end_date: "",
    notes: "",
  });

  // Action input states
  const [agreedAmount, setAgreedAmount] = useState("");
  const [actionNotes, setActionNotes] = useState("");

  // Load Midtrans Snap script
  useEffect(() => {
    const snapUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = "SB-Mid-client-demo"; // Demo/sandbox key fallback

    let scriptTag = document.querySelector(`script[src="${snapUrl}"]`);
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.src = snapUrl;
      scriptTag.setAttribute("data-client-key", clientKey);
      document.body.appendChild(scriptTag);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMyCooperations();
      if (response && response.data) {
        setCooperations(Array.isArray(response.data) ? response.data : []);
      } else if (Array.isArray(response)) {
        setCooperations(response);
      } else {
        setCooperations([]);
      }
    } catch (err) {
      console.error("Error fetching cooperations:", err);
      setError(err.message || "Gagal memuat data kerja sama.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Offer Form Input
  const handleOfferChange = (e) => {
    const { name, value } = e.target;
    setNewOffer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create Offer Submission
  const handleCreateOffer = async (e) => {
    e.preventDefault();
    setError("");

    if (!newOffer.farmer_id.trim()) {
      setError("ID Petani (Pemberi Kerja) wajib diisi.");
      return;
    }
    if (!newOffer.title.trim()) {
      setError("Judul kerja sama wajib diisi.");
      return;
    }
    if (!newOffer.proposed_amount || Number(newOffer.proposed_amount) <= 0) {
      setError("Nilai penawaran harus valid.");
      return;
    }
    if (!newOffer.start_date || !newOffer.end_date) {
      setError("Tanggal mulai dan selesai kerja sama wajib diisi.");
      return;
    }

    setActionProcessing(true);
    try {
      const payload = {
        farmer_id: newOffer.farmer_id.trim(),
        title: newOffer.title.trim(),
        description: newOffer.description.trim(),
        proposed_amount: Number(newOffer.proposed_amount),
        start_date: new Date(newOffer.start_date).toISOString(),
        end_date: new Date(newOffer.end_date).toISOString(),
        notes: newOffer.notes.trim(),
      };

      await createCooperationOffer(payload);
      setSuccess("Penawaran kerja sama berhasil diajukan ke Petani!");
      setIsCreateModalOpen(false);
      setNewOffer({
        farmer_id: "",
        title: "",
        description: "",
        proposed_amount: "",
        start_date: "",
        end_date: "",
        notes: "",
      });
      await fetchData();
    } catch (err) {
      console.error("Error creating offer:", err);
      setError(err.message || "Gagal mengajukan kerja sama.");
    } finally {
      setActionProcessing(false);
    }
  };

  // Open Detail Modal
  const handleOpenDetail = async (item) => {
    setSelectedCooperation(item);
    setIsDetailModalOpen(true);
    setModalLoading(true);
    try {
      const res = await getCooperationById(item.id);
      if (res && res.data) {
        setSelectedCooperation(res.data);
      }
    } catch (err) {
      console.error("Error fetching detail:", err);
    } finally {
      setModalLoading(false);
    }
  };

  // Open Approve Modal
  const handleOpenApprove = (item) => {
    setSelectedCooperation(item);
    setAgreedAmount(item.proposed_amount || item.agreed_amount || "");
    setActionNotes("Disetujui sesuai kesepakatan");
    setIsApproveModalOpen(true);
  };

  // Submit Approval
  const handleConfirmApprove = async () => {
    if (!selectedCooperation) return;
    setActionProcessing(true);
    setError("");
    try {
      await approveCooperation(selectedCooperation.id, {
        agreed_amount: Number(agreedAmount) || selectedCooperation.proposed_amount,
        notes: actionNotes.trim(),
      });
      setSuccess("Kerja sama berhasil disetujui!");
      setIsApproveModalOpen(false);
      setSelectedCooperation(null);
      await fetchData();
    } catch (err) {
      console.error("Error approving cooperation:", err);
      setError(err.message || "Gagal menyetujui kerja sama.");
    } finally {
      setActionProcessing(false);
    }
  };

  // Open Reject Modal
  const handleOpenReject = (item) => {
    setSelectedCooperation(item);
    setActionNotes("");
    setIsRejectModalOpen(true);
  };

  // Submit Rejection
  const handleConfirmReject = async () => {
    if (!selectedCooperation) return;
    setActionProcessing(true);
    setError("");
    try {
      await rejectCooperation(selectedCooperation.id, {
        notes: actionNotes.trim() || "Kapasitas saat ini belum mencukupi",
      });
      setSuccess("Kerja sama berhasil ditolak.");
      setIsRejectModalOpen(false);
      setSelectedCooperation(null);
      await fetchData();
    } catch (err) {
      console.error("Error rejecting cooperation:", err);
      setError(err.message || "Gagal menolak kerja sama.");
    } finally {
      setActionProcessing(false);
    }
  };

  // Midtrans Payment Trigger
  const handlePayMidtrans = async (item) => {
    setActionProcessing(true);
    setError("");
    try {
      const response = await initiateCooperationPayment(item.id);
      const snapToken =
        response?.data?.snap_token ||
        response?.snap_token ||
        response?.data?.token ||
        response?.token;

      if (!snapToken) {
        throw new Error("Token pembayaran Midtrans tidak ditemukan.");
      }

      if (window.snap && typeof window.snap.pay === "function") {
        window.snap.pay(snapToken, {
          onSuccess: function (result) {
            console.log("Payment success:", result);
            setSuccess("Pembayaran kerja sama berhasil diselesaikan!");
            fetchData();
          },
          onPending: function (result) {
            console.log("Payment pending:", result);
            setSuccess("Menunggu penyelesaian pembayaran oleh Mitra.");
            fetchData();
          },
          onError: function (result) {
            console.error("Payment error:", result);
            setError("Pembayaran gagal atau dibatalkan.");
          },
          onClose: function () {
            console.log("Customer closed the popup without finishing the payment");
          },
        });
      } else {
        alert(`Snap token diterima: ${snapToken}. Mode simulasi Midtrans terbuka.`);
      }
    } catch (err) {
      console.error("Error initiating payment:", err);
      setError(err.message || "Gagal inisiasi pembayaran Midtrans.");
    } finally {
      setActionProcessing(false);
    }
  };

  // Filter and Search logic
  const filteredCooperations = cooperations.filter((c) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.farmer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.mitra?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && c.status === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            <CheckCircle2 size={14} /> Disetujui
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            <XCircle size={14} /> Ditolak
          </span>
        );
      case "completed":
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            <CreditCard size={14} /> Selesai / Dibayar
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <Clock size={14} /> Menunggu Persetujuan
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-100 text-main rounded-xl">
              <Handshake size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-main">
                Kerja Sama Bisnis (B2B)
              </h1>
              <p className="text-gray-500 text-sm md:text-base">
                Kelola proposal pengadaan komoditas, pendanaan, dan kemitraan strategis dengan Petani.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={fetchData}
            className="p-3 text-gray-600 hover:text-main border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-main text-white font-semibold rounded-xl hover:bg-green-600 shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={18} />
            Buat Penawaran Kerja Sama
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total Kerja Sama</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{cooperations.length}</p>
          <span className="text-xs text-gray-400">Semua proposal B2B</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-medium text-amber-600">Menunggu Respon</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">
            {cooperations.filter((c) => c.status === "pending").length}
          </p>
          <span className="text-xs text-gray-400">Perlu ditindaklanjuti</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-medium text-green-600">Disetujui / Aktif</p>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {cooperations.filter((c) => c.status === "approved").length}
          </p>
          <span className="text-xs text-gray-400">Siap kontrak & bayar</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-medium text-blue-600">Selesai / Dibayar</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            {cooperations.filter((c) => c.status === "completed" || c.status === "paid").length}
          </p>
          <span className="text-xs text-gray-400">Dana telah diamankan</span>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-500 hover:text-red-700">
            <X size={16} />
          </button>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border-l-4 border-main rounded-r-xl text-green-800 text-sm flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess("")} className="text-green-600 hover:text-green-800">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search & Tabs Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {[
            { id: "all", label: "Semua" },
            { id: "pending", label: "Menunggu" },
            { id: "approved", label: "Disetujui" },
            { id: "completed", label: "Selesai" },
            { id: "rejected", label: "Ditolak" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-xl whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? "bg-main text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul / nama mitra..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Table / List View */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-8 h-8 border-4 border-main border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Memuat data kerja sama...
          </div>
        ) : filteredCooperations.length === 0 ? (
          <div className="p-12 text-center text-gray-500 space-y-3">
            <Handshake size={48} className="mx-auto text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-700">Belum Ada Kerja Sama</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Tidak ada proposal kerja sama B2B yang sesuai. Klik tombol "Buat Penawaran Kerja Sama" untuk memulai kemitraan baru.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Judul Kerja Sama</th>
                  <th className="px-6 py-4">Pemberi Kerja (Petani)</th>
                  <th className="px-6 py-4">Nilai Usulan / Kesepakatan</th>
                  <th className="px-6 py-4">Tanggal Pengajuan</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredCooperations.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 line-clamp-1">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Inisiator: <span className="capitalize font-medium text-gray-700">{item.initiator_type || "Mitra"}</span>
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-main flex items-center justify-center font-bold text-xs">
                          {item.farmer?.name?.charAt(0) || "P"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.farmer?.name || "Petani"}</p>
                          <p className="text-xs text-gray-500">{item.farmer?.email || item.farmer?.phone || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.agreed_amount || item.proposed_amount)}
                      </p>
                      {item.agreed_amount && item.agreed_amount !== item.proposed_amount && (
                        <p className="text-xs text-gray-400 line-through">
                          {formatCurrency(item.proposed_amount)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(item.created_at || item.start_date)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenDetail(item)}
                        className="p-2 text-gray-600 hover:text-main hover:bg-green-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </button>

                      {/* If status is pending and user can approve/reject */}
                      {item.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleOpenApprove(item)}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            title="Setujui Kerja Sama"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleOpenReject(item)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Tolak Kerja Sama"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}

                      {/* If status is approved and needs payment via Midtrans Snap */}
                      {item.status === "approved" && (
                        <button
                          onClick={() => handlePayMidtrans(item)}
                          disabled={actionProcessing}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-main text-white font-medium text-xs rounded-lg hover:bg-green-600 shadow-sm transition-all disabled:opacity-50"
                          title="Bayar Escrow Midtrans"
                        >
                          <CreditCard size={14} />
                          Bayar Midtrans
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal 1: Buat Penawaran Kerja Sama Baru */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-main">
                <Handshake size={24} />
                <h2 className="text-xl font-bold text-gray-900">Buat Penawaran Kerja Sama B2B</h2>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  ID Pemberi Kerja (Petani) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="farmer_id"
                  value={newOffer.farmer_id}
                  onChange={handleOfferChange}
                  placeholder="Contoh: f74320eb-2fe1-4dff-ac49-32e9d26ea589"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm font-mono"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Masukkan User ID atau UUID Petani yang ingin Anda ajak kerja sama.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Judul Proposal Kerja Sama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={newOffer.title}
                  onChange={handleOfferChange}
                  placeholder="Contoh: Kerja Sama Pasokan Kopi Arabica Kintamani 500kg"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Deskripsi & Ruang Lingkup Kerja Sama
                </label>
                <textarea
                  name="description"
                  value={newOffer.description}
                  onChange={handleOfferChange}
                  rows={3}
                  placeholder="Jelaskan kebutuhan pengadaan, spesifikasi komoditas, atau pola kemitraan..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nilai Penawaran (IDR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="proposed_amount"
                    value={newOffer.proposed_amount}
                    onChange={handleOfferChange}
                    placeholder="Contoh: 72500000"
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm"
                    required
                  />
                  {newOffer.proposed_amount && (
                    <p className="text-xs text-main font-semibold mt-1">
                      {formatCurrency(newOffer.proposed_amount)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Catatan Tambahan
                  </label>
                  <input
                    type="text"
                    name="notes"
                    value={newOffer.notes}
                    onChange={handleOfferChange}
                    placeholder="Contoh: Pengiriman bertahap setiap 2 minggu"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Tanggal Mulai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={newOffer.start_date}
                    onChange={handleOfferChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Tanggal Selesai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={newOffer.end_date}
                    onChange={handleOfferChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={actionProcessing}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionProcessing}
                  className="px-6 py-2.5 bg-main hover:bg-green-600 text-white rounded-xl text-sm font-semibold shadow-md transition-all disabled:opacity-50"
                >
                  {actionProcessing ? "Mengirim..." : "Kirim Penawaran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Detail Kerja Sama */}
      {isDetailModalOpen && selectedCooperation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">Detail Proposal Kerja Sama</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Header Details */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedCooperation.title}</h3>
                    <p className="text-xs text-gray-500">ID: {selectedCooperation.id}</p>
                  </div>
                  {getStatusBadge(selectedCooperation.status)}
                </div>
                {selectedCooperation.description && (
                  <p className="text-sm text-gray-700 pt-2 border-t border-gray-200/50">
                    {selectedCooperation.description}
                  </p>
                )}
              </div>

              {/* Parties info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50/50 rounded-xl border border-green-100">
                  <div className="flex items-center gap-2 text-main font-semibold text-sm mb-2">
                    <User size={16} /> Pemberi Kerja (Petani)
                  </div>
                  <p className="font-bold text-gray-900">{selectedCooperation.farmer?.name || "-"}</p>
                  <p className="text-xs text-gray-600">{selectedCooperation.farmer?.email || "-"}</p>
                  <p className="text-xs text-gray-600">{selectedCooperation.farmer?.phone || "-"}</p>
                </div>

                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-2">
                    <Building size={16} /> Mitra Bisnis (B2B)
                  </div>
                  <p className="font-bold text-gray-900">{selectedCooperation.mitra?.name || "-"}</p>
                  <p className="text-xs text-gray-600">{selectedCooperation.mitra?.email || "-"}</p>
                </div>
              </div>

              {/* Financial & Schedule */}
              <div className="grid grid-cols-2 gap-4 p-4 border border-gray-100 rounded-xl text-sm">
                <div>
                  <span className="text-gray-500 text-xs block">Nilai Usulan:</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(selectedCooperation.proposed_amount)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block">Nilai Disepakati:</span>
                  <span className="font-bold text-main">
                    {formatCurrency(selectedCooperation.agreed_amount || selectedCooperation.proposed_amount)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block">Periode Mulai:</span>
                  <span className="font-medium text-gray-800">
                    {formatDate(selectedCooperation.start_date)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block">Periode Selesai:</span>
                  <span className="font-medium text-gray-800">
                    {formatDate(selectedCooperation.end_date)}
                  </span>
                </div>
              </div>

              {selectedCooperation.notes && (
                <div className="p-4 bg-gray-50 rounded-xl text-sm">
                  <span className="text-xs font-semibold text-gray-500 block mb-1">Catatan:</span>
                  <p className="text-gray-700">{selectedCooperation.notes}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-sm transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Setujui Kerja Sama */}
      {isApproveModalOpen && selectedCooperation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircle2 size={26} />
              <h3 className="text-lg font-bold text-gray-900">Setujui Kerja Sama</h3>
            </div>
            <p className="text-sm text-gray-600">
              Konfirmasi persetujuan kerja sama <strong>"{selectedCooperation.title}"</strong>.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nilai yang Disepakati (IDR)
                </label>
                <input
                  type="number"
                  value={agreedAmount}
                  onChange={(e) => setAgreedAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Catatan Persetujuan
                </label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm resize-none"
                  placeholder="Catatan kesepakatan..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsApproveModalOpen(false)}
                disabled={actionProcessing}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 text-sm"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmApprove}
                disabled={actionProcessing}
                className="px-5 py-2 bg-main text-white font-semibold rounded-xl hover:bg-green-600 text-sm shadow-md disabled:opacity-50"
              >
                {actionProcessing ? "Memproses..." : "Setujui Sekarang"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Tolak Kerja Sama */}
      {isRejectModalOpen && selectedCooperation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <XCircle size={26} />
              <h3 className="text-lg font-bold text-gray-900">Tolak Kerja Sama</h3>
            </div>
            <p className="text-sm text-gray-600">
              Apakah Anda yakin ingin menolak proposal kerja sama <strong>"{selectedCooperation.title}"</strong>?
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Alasan Penolakan
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm resize-none"
                placeholder="Contoh: Kapasitas panen belum mencukupi untuk kuota yang diminta..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                disabled={actionProcessing}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 text-sm"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={actionProcessing}
                className="px-5 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 text-sm shadow-md disabled:opacity-50"
              >
                {actionProcessing ? "Memproses..." : "Konfirmasi Tolak"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MitraCooperationPage;
