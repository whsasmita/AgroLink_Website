import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdPayment, MdReceipt, MdArrowBack } from "react-icons/md";

const PaymentListPage = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard/projects");
  };
  
  // Empty payments array - replace with actual data from your API
  const payments = [];

  // Filter payments based on search term
  const filteredPayments = payments.filter((payment) =>
    payment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row bg-white rounded-lg shadow-sm p-4 justify-between items-start sm:items-center mb-4 gap-4">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MdArrowBack size={24} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-main mb-2">
              Daftar Pembayaran
            </h1>
            <p className="text-main_text text-sm sm:text-base">
              Kelola dan pantau semua pembayaran Anda
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-danger p-4 rounded-r-lg">
          <span className="text-danger font-medium text-sm sm:text-base">
            {error}
          </span>
        </div>
      )}

      {/* Search */}
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
              placeholder="Cari daftar pembayaran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-4">
              <MdReceipt size={64} className="text-gray-300 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {payments.length === 0
                ? "Belum Ada Pembayaran"
                : "Tidak Ada Data yang Sesuai"}
            </h3>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">
              {payments.length === 0
                ? "Daftar pembayaran Anda akan muncul di sini setelah Anda membuat pembayaran."
                : "Coba ubah kriteria pencarian Anda."}
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
                    Deskripsi
                  </th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base hidden sm:table-cell">
                    Penerima
                  </th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base hidden md:table-cell">
                    Jumlah
                  </th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base hidden sm:table-cell">
                    Tanggal
                  </th>
                  <th className="text-center px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment, index) => (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-main_text text-sm sm:text-base">
                      {index + 1}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm sm:text-base break-words">
                          {payment.description}
                        </p>
                        <div className="sm:hidden text-xs text-gray-500 mt-1">
                          <div>{payment.recipient}</div>
                          <div className="md:hidden">{payment.amount}</div>
                          <div>{payment.date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-main_text text-sm sm:text-base hidden sm:table-cell">
                      {payment.recipient}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-main_text text-sm sm:text-base font-medium hidden md:table-cell">
                      {payment.amount}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-main_text text-sm sm:text-base hidden sm:table-cell">
                      {payment.date}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          payment.status === 'Lunas' 
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
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
  );
};

export default PaymentListPage;