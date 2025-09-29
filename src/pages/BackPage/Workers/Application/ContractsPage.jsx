import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Check,
  FileText,
  Calendar,
  Briefcase,
  Users,
  RotateCcw,
  Building,
  FileCheck,
  Download,
} from "lucide-react";
import { getContracts, signContract, downloadContract } from "../../../../services/contractService";

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="p-4">
    <div className="flex items-center mb-6">
      <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse mr-4"></div>
      <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
    </div>
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="w-64 h-10 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex gap-2">
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Utility function to get status config
const getContractStatusConfig = (status) => {
  const statusConfig = {
    'draft': { label: 'Draft', className: 'bg-gray-100 text-gray-800' },
    'pending': { label: 'Menunggu Tanda Tangan', className: 'bg-yellow-100 text-yellow-800' },
    'pending_signature': { label: 'Menunggu Tanda Tangan', className: 'bg-yellow-100 text-yellow-800' },
    'signed': { label: 'Ditandatangani', className: 'bg-green-100 text-green-800' },
    'active': { label: 'Aktif', className: 'bg-blue-100 text-blue-800' },
    'completed': { label: 'Selesai', className: 'bg-emerald-100 text-emerald-800' },
    'terminated': { label: 'Dihentikan', className: 'bg-red-100 text-red-800' },
    'cancelled': { label: 'Dibatalkan', className: 'bg-red-100 text-red-800' }
  };
  return statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
};

// Utility function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'Tidak disebutkan';
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Format tanggal tidak valid';
  }
};

// Utility function to format currency
const formatCurrency = (amount) => {
  if (!amount) return 'Tidak disebutkan';
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  } catch (error) {
    return `Rp ${amount}`;
  }
};

const ContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [downloading, setDownloading] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getContracts();
      console.log("Contracts Response:", response);
      if (response && response.status === "success" && response.data) {
        setContracts(response.data);
      } else if (response && Array.isArray(response)) {
        setContracts(response);
      } else {
        setContracts([]);
      }
    } catch (err) {
      console.error("Error fetching contracts:", err);
      if (err.message.includes('404')) {
        setError("Kontrak tidak ditemukan.");
      } else if (err.message.includes('401') || err.message.includes('403')) {
        setError("Anda tidak memiliki akses untuk melihat kontrak.");
      } else if (err.message.includes('500')) {
        setError("Server mengalami masalah. Silakan coba lagi nanti.");
      } else {
        setError(err.message || "Gagal memuat data kontrak.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBack = () => {
    // navigate("/dashboard");
    console.log("Navigate back to dashboard");
  };

  const handleSignClick = (contract) => {
    setSelectedContract(contract);
    setSignModalOpen(true);
  };

  const handleSignConfirm = async () => {
    if (!selectedContract) return;
    setProcessing(true);
    try {
      const contractToSignId = selectedContract.contract_id || selectedContract.id;
      if (!contractToSignId) {
        throw new Error("ID kontrak tidak ditemukan.");
      }
      const response = await signContract(contractToSignId);
      if (response && (response.status === "success" || response.message === "success")) {
        setContracts(prev =>
          prev.map(contract =>
            (contract.contract_id || contract.id) === contractToSignId
              ? { ...contract, status: 'signed', signed_date: new Date().toISOString() }
              : contract
          )
        );
        setError("");
      } else {
        setError("Gagal menandatangani kontrak.");
      }
    } catch (err) {
      console.error("Error signing contract:", err);
      setError(err.message || "Gagal menandatangani kontrak.");
    } finally {
      setProcessing(false);
      setSignModalOpen(false);
      setSelectedContract(null);
    }
  };

  const handleDownloadClick = async (contractId) => {
    setDownloading(contractId);
    try {
      await downloadContract(contractId);
    } catch (err) {
      console.error("Download failed:", err);
      setError("Gagal mengunduh kontrak: " + err.message);
    } finally {
      setDownloading(null);
    }
  };

  const getStatusBadge = (status) => {
    const config = getContractStatusConfig(status);
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-main">Kontrak Proyek</h2>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex">
              <FileText className="text-red-500 mr-3 mt-1" size={20} />
              <div>
                <h3 className="text-lg font-medium text-red-800 mb-1">Terjadi Kesalahan</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={fetchData}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-main">Kontrak Proyek</h2>
            <p className="text-gray-600 mt-1">Kelola kontrak proyek Anda</p>
          </div>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 text-main border border-main rounded-lg hover:bg-main hover:text-white transition-colors"
        >
          <RotateCcw size={16} />
          Refresh
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <FileText className="text-main" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ringkasan Kontrak</h3>
              <p className="text-gray-600 text-sm">Total kontrak yang tersedia</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FileCheck className="text-gray-400" size={16} />
              <span className="text-gray-600">Total Kontrak: </span>
              <span className="font-medium">{contracts.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-green-500" size={16} />
              <span className="text-gray-600">Ditandatangani: </span>
              <span className="font-medium">{contracts.filter(c => c.status === 'signed').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-yellow-500" size={16} />
              <span className="text-gray-600">Menunggu: </span>
              <span className="font-medium">{contracts.filter(c => c.status === 'pending' || c.status === 'pending_signature').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="text-main" size={16} />
              <span className="text-gray-600">Aktif: </span>
              <span className="font-medium">{contracts.filter(c => c.status === 'active').length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Kontrak</h3>
            <p className="text-sm text-gray-600 mt-1">
              Tanda tangani kontrak proyek yang telah disetujui
            </p>
          </div>

          {contracts.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Kontrak</h3>
              <p className="text-gray-500">Tidak ada kontrak yang tersedia saat ini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proyek
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pekerja
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nilai Kontrak
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Mulai
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contracts.map((contract) => (
                    <tr key={contract.contract_id || contract.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-main flex items-center justify-center">
                              <Briefcase className="text-white" size={20} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {contract.project_title || contract.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {contract.project_id || contract.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-slate-300 flex items-center justify-center">
                              <Users className="text-white" size={20} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm text-gray-900">
                              {contract.worker_name || 'Tidak disebutkan'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(contract.contract_value || contract.payment_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(contract.start_date || contract.created_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(contract.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {(contract.status === 'pending' || contract.status === 'pending_signature') ? (
                            <button
                              onClick={() => handleSignClick(contract)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-main hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                            >
                              <Check size={16} className="mr-2" />
                              Tanda Tangani
                            </button>
                          ) : (
                            <div className="flex items-center space-x-2">
                              {/* Tambahkan Tombol Unduh untuk semua status kecuali draft/pending */}
                              {(contract.status !== 'draft' && contract.status !== 'pending' && contract.status !== 'pending_signature') && (
                                <button
                                  onClick={() => handleDownloadClick(contract.contract_id || contract.id)}
                                  disabled={downloading === (contract.contract_id || contract.id)}
                                  className="p-2 text-main border border-main rounded-md hover:bg-main hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {downloading === (contract.contract_id || contract.id) ? (
                                    <div className="w-4 h-4 border-2 border-main border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Download size={16} />
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {signModalOpen && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Konfirmasi Tanda Tangan Kontrak
            </h3>
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Apakah Anda yakin ingin menandatangani kontrak untuk proyek:
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-900">
                  {selectedContract.project_title || selectedContract.title}
                </p>
                <p className="text-sm text-gray-600">
                  Nilai: {formatCurrency(selectedContract.contract_value || selectedContract.payment_amount)}
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Dengan menandatangani, Anda menyetujui semua ketentuan yang tercantum dalam kontrak ini.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setSignModalOpen(false)}
                disabled={processing}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleSignConfirm}
                disabled={processing}
                className="px-4 py-2 text-white bg-main rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menandatangani...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Tanda Tangani Kontrak
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

export default ContractsPage;