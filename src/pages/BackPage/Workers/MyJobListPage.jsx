import { useState, useEffect, useCallback } from "react";
import {
  Check,
  FileText,
  Calendar,
  Briefcase,
  Users,
  RotateCcw,
  Building,
  FileCheck,
  Download,
  Plus,
  Search,
  Briefcase as WorkIcon,
} from "lucide-react";
import { getContracts, signContract, downloadContract } from "../../../services/contractService";
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import DropdownPaginationControls from "../../../components/compound/pagination/DropdownPaginationControls";

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="p-2 sm:p-4">
    <div className="flex flex-col items-start justify-between gap-4 p-4 mb-4 bg-white rounded-lg shadow-sm sm:flex-row sm:items-center">
      <div className="w-full sm:w-auto">
        <div className="w-48 h-8 mb-2 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
    <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
      <div className="w-64 h-10 mb-4 bg-gray-200 rounded animate-pulse"></div>
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

const MyJobListPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [downloading, setDownloading] = useState(null);

  // State paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const paginationOptions = [10, 20, 50, 100];

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

  // Filter contracts based on search term
  const filteredContracts = contracts.filter((contract) =>
    (contract.project_title || contract.title || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredContracts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedContracts = filteredContracts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 p-4 mb-4 bg-white rounded-lg shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl text-main">
            Daftar Pekerjaan
          </h1>
          <p className="text-sm text-gray-600 sm:text-base">
            Kelola daftar pekerjaan Anda
          </p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          {/* <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 text-sm text-green-600 transition-colors border border-green-600 rounded-lg hover:bg-green-600 hover:text-white sm:text-base"
          >
            <RotateCcw size={16} />
            Refresh
          </button> */}
          <a
            href="/projects"
            className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg shadow-lg sm:px-6 sm:py-3 bg-main hover:bg-green-700 hover:shadow-xl sm:text-base sm:flex-initial"
          >
            <Plus size={20} />
            <span>Cari Pekerjaan</span>
          </a>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 border-l-4 border-red-500 rounded-r-lg bg-red-50">
          <div className="flex">
            <FileText className="mt-1 mr-3 text-red-500" size={20} />
            <div>
              <h3 className="mb-1 text-lg font-medium text-red-800">Terjadi Kesalahan</h3>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchData}
                className="px-4 py-2 mt-3 text-sm text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {/* <div className="p-4 mb-4 bg-white rounded-lg shadow-lg sm:p-6">
        <div className="flex items-center gap-4 mb-4">
          <FileText className="text-green-600" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Ringkasan Kontrak</h3>
            <p className="text-sm text-gray-600">Total kontrak yang tersedia</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4 sm:gap-4">
          <div className="flex items-center gap-2">
            <FileCheck className="flex-shrink-0 text-gray-400" size={16} />
            <span className="text-xs text-gray-600 sm:text-sm">Total: </span>
            <span className="font-medium">{contracts.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="flex-shrink-0 text-green-500" size={16} />
            <span className="text-xs text-gray-600 sm:text-sm">Ditandatangani: </span>
            <span className="font-medium">{contracts.filter(c => c.status === 'signed').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="flex-shrink-0 text-yellow-500" size={16} />
            <span className="text-xs text-gray-600 sm:text-sm">Menunggu: </span>
            <span className="font-medium">{contracts.filter(c => c.status === 'pending' || c.status === 'pending_signature').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="flex-shrink-0 text-green-600" size={16} />
            <span className="text-xs text-gray-600 sm:text-sm">Aktif: </span>
            <span className="font-medium">{contracts.filter(c => c.status === 'active').length}</span>
          </div>
        </div>
      </div> */}

      {/* Search */}
      <div className="p-4 mb-4 bg-white border border-gray-100 rounded-lg shadow-sm">
        <div className="relative">
          <Search
            className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari kontrak proyek..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg sm:py-3 focus:ring-2 focus:ring-main focus:border-transparent sm:text-base"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="px-4 py-4 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Daftar Kontrak</h3>
          <p className="mt-1 text-sm text-gray-600">
            Tanda tangani kontrak proyek yang telah disetujui
          </p>
        </div>

        {filteredContracts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-4">
              {contracts.length === 0 ? (
                <FileText size={64} className="mx-auto text-gray-300" />
              ) : (
                <WorkIcon size={64} className="mx-auto text-gray-300" />
              )}
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {contracts.length === 0
                ? "Belum Ada Kontrak"
                : "Tidak Ada Data yang Sesuai"}
            </h3>
            <p className="mb-4 text-sm text-gray-500 sm:text-base">
              {contracts.length === 0
                ? "Tidak ada kontrak yang tersedia saat ini."
                : "Coba ubah kriteria pencarian Anda."}
            </p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6">
                      Proyek
                    </th>
                    {/* <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6">
                      Pekerja
                    </th>
                    <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6">
                      Nilai Kontrak
                    </th>
                    <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6">
                      Tanggal Mulai
                    </th> */}
                    <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6">
                      Status
                    </th>
                    <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedContracts.map((contract) => (
                    <tr key={contract.contract_id || contract.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-main">
                              <Briefcase className="text-white" size={20} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {contract.project_title || contract.title}
                            </div>
                            {/* <div className="text-xs text-gray-500">
                              ID: {contract.project_id || contract.id}
                            </div> */}
                          </div>
                        </div>
                      </td>
                      {/* <td className="px-3 py-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-300">
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
                      <td className="px-3 py-4 text-sm text-gray-900 sm:px-6 whitespace-nowrap">
                        {formatCurrency(contract.contract_value || contract.payment_amount)}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 sm:px-6 whitespace-nowrap">
                        {formatDate(contract.start_date || contract.created_date)}
                      </td> */}
                      <td className="px-3 py-4 sm:px-6 whitespace-nowrap">
                        {getStatusBadge(contract.status)}
                      </td>
                      <td className="px-3 py-4 text-sm font-medium sm:px-6 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {(contract.status === 'pending' || contract.status === 'pending_signature') ? (
                            <button
                              onClick={() => handleSignClick(contract)}
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white transition-colors border border-transparent rounded-md sm:px-4 bg-main hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <Check size={16} className="mr-2" />
                              Tanda Tangani
                            </button>
                          ) : (
                            <div className="flex items-center space-x-2">
                              {(contract.status !== 'draft' && contract.status !== 'pending' && contract.status !== 'pending_signature') && (
                                <button
                                  onClick={() => handleDownloadClick(contract.contract_id || contract.id)}
                                  disabled={downloading === (contract.contract_id || contract.id)}
                                  className="p-2 transition-colors border rounded-md text-main border-main hover:bg-main hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Unduh Kontrak"
                                >
                                  {downloading === (contract.contract_id || contract.id) ? (
                                    <div className="w-4 h-4 border-2 rounded-full border-main border-t-transparent animate-spin"></div>
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
            <DropdownPaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              paginationOptions={paginationOptions}
              totalItems={totalItems}
              itemType="kontrak"
            />
          </div>
        )}
      </div>

      {/* Sign Modal */}
      {signModalOpen && selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Konfirmasi Tanda Tangan Kontrak
            </h3>
            <div className="mb-6">
              <p className="mb-4 text-gray-600">
                Apakah Anda yakin ingin menandatangani kontrak untuk proyek:
              </p>
              <div className="p-3 rounded-lg bg-gray-50">
                <p className="font-medium text-gray-900">
                  {selectedContract.project_title || selectedContract.title}
                </p>
                <p className="text-sm text-gray-600">
                  Nilai: {formatCurrency(selectedContract.contract_value || selectedContract.payment_amount)}
                </p>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                Dengan menandatangani, Anda menyetujui semua ketentuan yang tercantum dalam kontrak ini.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSignModalOpen(false)}
                disabled={processing}
                className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleSignConfirm}
                disabled={processing}
                className="flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg bg-main hover:bg-green-700 disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
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

export default MyJobListPage;