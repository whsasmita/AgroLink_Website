import { MdEdit, MdSearch, MdHistory } from "react-icons/md";

const NotificationPage = () => {
    return (
        // <div className="p-4">
        //     <h1 className="mb-4 text-2xl font-bold">Notifications</h1>
        //     <p>This is the notifications page.</p>
        // </div>
        <div className="p-2 sm:p-4">
            {/* Header */}
            <div className="flex flex-col items-start justify-between gap-4 p-4 mb-4 bg-white rounded-lg shadow-sm sm:flex-row sm:items-center">
            <div>
                <h1 className="mb-2 text-2xl font-bold sm:text-3xl text-main">
                Riwayat Notifikasi
                </h1>
                <p className="text-sm text-main_text sm:text-base">
                Lihat riwayat notifikasi dan aktivitas Anda
                </p>
            </div>
            </div>

            {/* Error Message */}
            {/* {error && (
            <div className="p-4 mb-6 border-l-4 rounded-r-lg bg-red-50 border-danger">
                <span className="text-sm font-medium text-danger sm:text-base">
                {error}
                </span>
            </div>
            )} */}

            <div className="p-4 mb-6 border-l-4 rounded-r-lg bg-red-50 border-danger">
                <span className="text-sm font-medium text-danger sm:text-base">
                </span>
            </div>

            {/* Search */}
            <div className="p-4 mb-4 bg-white border border-gray-100 rounded-lg shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row">
                {/* Search Input */}
                <div className="relative flex-1">
                <MdSearch
                    className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                    size={20}
                />
                {/* <input
                    type="text"
                    placeholder="Cari riwayat transaksi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg sm:py-3 focus:ring-2 focus:ring-main focus:border-transparent sm:text-base"
                /> */}
                <input
                    type="text"
                    placeholder="Cari riwayat transaksi..."
                    className="w-full py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg sm:py-3 focus:ring-2 focus:ring-main focus:border-transparent sm:text-base"
                />
                </div>
            </div>
            </div>

            {/* Content Area */}
            
            {/* <div className="overflow-hidden bg-white rounded-lg shadow-lg">
            {filteredTransactions.length === 0 ? (
                <div className="p-8 text-center">
                <div className="mb-4">
                    <MdHistory size={64} className="mx-auto text-gray-300" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                    {transactions.length === 0
                    ? "Belum Ada Transaksi"
                    : "Tidak Ada Data yang Sesuai"}
                </h3>
                <p className="mb-4 text-sm text-gray-500 sm:text-base">
                    {transactions.length === 0
                    ? "Riwayat transaksi Anda akan muncul di sini setelah Anda melakukan aktivitas."
                    : "Coba ubah kriteria pencarian Anda."}
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
                        <th className="text-left px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base min-w-[200px]">
                        Deskripsi
                        </th>
                        <th className="hidden px-3 py-3 text-sm font-semibold text-left text-gray-900 sm:px-6 sm:py-4 sm:text-base sm:table-cell">
                        Tanggal
                        </th>
                        <th className="px-3 py-3 text-sm font-semibold text-center text-gray-900 sm:px-6 sm:py-4 sm:text-base">
                        Status
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTransactions.map((transaction, index) => (
                        <tr
                        key={transaction.id}
                        className="transition-colors border-b border-gray-100 hover:bg-gray-50"
                        >
                        <td className="px-3 py-3 text-sm sm:px-6 sm:py-4 text-main_text sm:text-base">
                            {index + 1}
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4">
                            <div>
                            <p className="text-sm font-medium text-gray-900 break-words sm:text-base">
                                {transaction.description}
                            </p>
                            <div className="mt-1 text-xs text-gray-500 sm:hidden">
                                {transaction.date}
                            </div>
                            </div>
                        </td>
                        <td className="hidden px-3 py-3 text-sm sm:px-6 sm:py-4 text-main_text sm:text-base sm:table-cell">
                            {transaction.date}
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4">
                            <div className="flex justify-center">
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-main bg-opacity-10 text-main sm:text-sm">
                                {transaction.status}
                            </span>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            </div> */}
            <div className="overflow-hidden bg-white rounded-lg shadow-lg">
                <div className="p-8 text-center">
                <div className="mb-4">
                    <MdHistory size={64} className="mx-auto text-gray-300" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                    Belum Ada Notifikasi
                </h3>
                <p className="mb-4 text-sm text-gray-500 sm:text-base">
                    Riwayat notifikasi Anda akan muncul di sini setelah Anda melakukan aktivitas.
                </p>
                </div>
            </div>
        </div>
    );
}

export default NotificationPage;