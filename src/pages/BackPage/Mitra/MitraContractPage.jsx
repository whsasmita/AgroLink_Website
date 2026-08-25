import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Download,
  CheckCircle2,
  Clock,
  RotateCcw,
  Search,
  Check,
  Building,
  User,
  Calendar,
  DollarSign,
  AlertCircle,
  FileCheck,
  X,
} from "lucide-react";
import {
  getContracts,
  downloadContract,
  signContract,
} from "../../../services/contractService";

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

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

const getContractStatusBadge = (status) => {
  switch (status) {
    case "signed":
    case "active":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          <CheckCircle2 size={14} /> Ditandatangani / Aktif
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
          <FileCheck size={14} /> Selesai
        </span>
      );
    case "pending":
    case "pending_signature":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
          <Clock size={14} /> Menunggu TTD
        </span>
      );
    case "terminated":
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          Dibatalkan
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
          {status || "Draft"}
        </span>
      );
  }
};

const MitraContractPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [downloadingId, setDownloadingId] = useState(null);
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [processingSign, setProcessingSign] = useState(false);

  const fetchContractsData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getContracts();
      if (response && response.data) {
        setContracts(Array.isArray(response.data) ? response.data : []);
      } else if (Array.isArray(response)) {
        setContracts(response);
      } else {
        setContracts([]);
      }
    } catch (err) {
      console.error("Error fetching contracts:", err);
      setError(err.message || "Gagal memuat daftar kontrak kerja sama.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContractsData();
  }, [fetchContractsData]);

  const handleDownload = async (contractId) => {
    setDownloadingId(contractId);
    setError("");
    try {
      await downloadContract(contractId);
      setSuccess("PDF Kontrak berhasil diunduh.");
    } catch (err) {
      console.error("Download contract error:", err);
      setError(err.message || "Gagal mengunduh file PDF kontrak.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleOpenSignModal = (contract) => {
    setSelectedContract(contract);
    setSignModalOpen(true);
  };

  const handleConfirmSign = async () => {
    if (!selectedContract) return;
    const contractId = selectedContract.contract_id || selectedContract.id;
    setProcessingSign(true);
    setError("");
    try {
      await signContract(contractId);
      setSuccess("Kontrak kerja sama resmi ditandatangani secara digital!");
      setSignModalOpen(false);
      setSelectedContract(null);
      await fetchContractsData();
    } catch (err) {
      console.error("Sign contract error:", err);
      setError(err.message || "Gagal menandatangani kontrak.");
    } finally {
      setProcessingSign(false);
    }
  };

  const filteredContracts = contracts.filter((c) => {
    const title = c.project_title || c.title || "";
    const partner = c.worker_name || c.farmer_name || c.farmer?.name || "";
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "pending")
      return (
        matchesSearch &&
        (c.status === "pending" || c.status === "pending_signature")
      );
    if (statusFilter === "signed")
      return (
        matchesSearch && (c.status === "signed" || c.status === "active")
      );
    return matchesSearch && c.status === statusFilter;
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
            <FileText size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-main">
              Kontrak & Dokumen Legal (B2B)
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              Kelola, tanda tangani, dan unduh dokumen kontrak kerja sama resmi antara Mitra dan Pemberi Kerja.
            </p>
          </div>
        </div>

        <button
          onClick={fetchContractsData}
          className="flex items-center gap-2 px-4 py-2.5 text-main border border-main rounded-xl hover:bg-main hover:text-white transition-colors"
        >
          <RotateCcw size={16} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total Kontrak</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{contracts.length}</p>
          <span className="text-xs text-gray-400">Semua dokumen</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-medium text-green-600">Ditandatangani / Aktif</p>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {contracts.filter((c) => c.status === "signed" || c.status === "active").length}
          </p>
          <span className="text-xs text-gray-400">Berlaku secara legal</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-medium text-yellow-600">Menunggu TTD</p>
          <p className="text-2xl font-bold text-yellow-700 mt-1">
            {contracts.filter((c) => c.status === "pending" || c.status === "pending_signature").length}
          </p>
          <span className="text-xs text-gray-400">Perlu ditandatangani</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-medium text-blue-600">Selesai</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            {contracts.filter((c) => c.status === "completed").length}
          </p>
          <span className="text-xs text-gray-400">Kemitraan tuntas</span>
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

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {[
            { id: "all", label: "Semua" },
            { id: "signed", label: "Ditandatangani" },
            { id: "pending", label: "Menunggu TTD" },
            { id: "completed", label: "Selesai" },
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

        <div className="relative w-full md:w-72">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kontrak..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-8 h-8 border-4 border-main border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Memuat data kontrak...
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="p-12 text-center text-gray-500 space-y-3">
            <FileText size={48} className="mx-auto text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-700">Tidak Ada Dokumen Kontrak</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Dokumen kontrak kerja sama resmi akan otomatis dibuat setelah penawaran kerja sama disetujui.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Dokumen Kontrak</th>
                  <th className="px-6 py-4">Pihak Terkait</th>
                  <th className="px-6 py-4">Nilai Kontrak</th>
                  <th className="px-6 py-4">Tanggal Mulai</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredContracts.map((contract) => {
                  const contractId = contract.contract_id || contract.id;
                  const isPendingSign =
                    contract.status === "pending" ||
                    contract.status === "pending_signature";

                  return (
                    <tr key={contractId} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-green-50 text-main rounded-xl">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">
                              {contract.project_title || contract.title || "Kontrak Kerja Sama B2B"}
                            </p>
                            <p className="text-xs text-gray-500">ID: {contractId}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {contract.farmer_name || contract.farmer?.name || contract.worker_name || "Pemberi Kerja"}
                        </p>
                        <p className="text-xs text-gray-500">Mitra & Petani</p>
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {formatCurrency(contract.contract_value || contract.payment_amount || contract.agreed_amount)}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(contract.start_date || contract.created_date || contract.created_at)}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {getContractStatusBadge(contract.status)}
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        {/* Sign button if pending */}
                        {isPendingSign && (
                          <button
                            onClick={() => handleOpenSignModal(contract)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-main text-white font-medium text-xs rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                          >
                            <Check size={14} />
                            Tanda Tangani
                          </button>
                        )}

                        {/* Download PDF button */}
                        <button
                          onClick={() => handleDownload(contractId)}
                          disabled={downloadingId === contractId}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-main text-main font-medium text-xs rounded-lg hover:bg-main hover:text-white transition-colors disabled:opacity-50"
                          title="Unduh PDF Resmi"
                        >
                          {downloadingId === contractId ? (
                            <div className="w-3.5 h-3.5 border-2 border-main border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Download size={14} />
                          )}
                          Unduh PDF
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Signature Confirmation Modal */}
      {signModalOpen && selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-main">
              <FileCheck size={28} />
              <h3 className="text-lg font-bold text-gray-900">
                Tanda Tangani Kontrak Digital
              </h3>
            </div>

            <p className="text-sm text-gray-600">
              Apakah Anda yakin ingin menandatangani dokumen kontrak resmi untuk:
            </p>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm space-y-1">
              <p className="font-bold text-gray-900">
                {selectedContract.project_title || selectedContract.title || "Kontrak Kerja Sama"}
              </p>
              <p className="text-xs text-gray-500">
                Nilai Kontrak:{" "}
                <span className="font-semibold text-main">
                  {formatCurrency(
                    selectedContract.contract_value || selectedContract.payment_amount || selectedContract.agreed_amount
                  )}
                </span>
              </p>
            </div>

            <p className="text-xs text-gray-500">
              Dengan mengonfirmasi tanda tangan ini, Anda menyetujui seluruh klausul kemitraan, jadwal pasokan, dan tata kelola pembayaran escrow yang tercantum dalam dokumen resmi.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSignModalOpen(false)}
                disabled={processingSign}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 text-sm"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmSign}
                disabled={processingSign}
                className="px-5 py-2 bg-main text-white font-semibold rounded-xl hover:bg-green-600 text-sm shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {processingSign ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memproses TTD...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Tanda Tangani Sekarang
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MitraContractPage;
