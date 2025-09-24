import { useState } from "react";
import { MdSearch, MdNotifications, MdCircle } from "react-icons/md";

const NotificationPage = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  
  // Empty notifications array - replace with actual data from your API
  const notifications = [];

  // Filter notifications based on search term
  const filteredNotifications = notifications.filter((notification) =>
    notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get notification type badge
  const getNotificationTypeBadge = (type) => {
    const typeConfig = {
      'info': { label: 'Info', className: 'bg-blue-100 text-blue-800' },
      'success': { label: 'Sukses', className: 'bg-green-100 text-green-800' },
      'warning': { label: 'Peringatan', className: 'bg-yellow-100 text-yellow-800' },
      'error': { label: 'Error', className: 'bg-red-100 text-red-800' },
      'system': { label: 'Sistem', className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = typeConfig[type] || { label: type, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hari ini';
    } else if (diffDays === 1) {
      return 'Kemarin';
    } else if (diffDays < 7) {
      return `${diffDays} hari lalu`;
    } else {
      return date.toLocaleDateString('id-ID');
    }
  };

  return (
    <div className="p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row bg-white rounded-lg shadow-sm p-4 justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-main mb-2">
            Notifikasi
          </h1>
          <p className="text-main_text text-sm sm:text-base">
            Lihat semua pemberitahuan dan update terbaru
          </p>
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
              placeholder="Cari notifikasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-4">
              <MdNotifications size={64} className="text-gray-300 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {notifications.length === 0
                ? "Belum Ada Notifikasi"
                : "Tidak Ada Data yang Sesuai"}
            </h3>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">
              {notifications.length === 0
                ? "Notifikasi akan muncul di sini ketika ada update terbaru."
                : "Coba ubah kriteria pencarian Anda."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base">
                    Status
                  </th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base min-w-[200px]">
                    Judul
                  </th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base hidden lg:table-cell">
                    Pesan
                  </th>
                  <th className="text-center px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base">
                    Tipe
                  </th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base hidden sm:table-cell">
                    Waktu
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.map((notification, index) => (
                  <tr
                    key={notification.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notification.is_read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex justify-center">
                        <MdCircle 
                          size={8} 
                          className={`${
                            !notification.is_read ? 'text-blue-500' : 'text-gray-300'
                          }`} 
                        />
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div>
                        <p className={`text-sm sm:text-base break-words ${
                          !notification.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                        }`}>
                          {notification.title}
                        </p>
                        <div className="sm:hidden text-xs text-gray-500 mt-1">
                          {formatDate(notification.created_at)}
                        </div>
                        <div className="lg:hidden text-xs text-gray-600 mt-1">
                          {notification.message}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-main_text text-sm sm:text-base hidden lg:table-cell max-w-xs">
                      <p className="truncate" title={notification.message}>
                        {notification.message}
                      </p>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex justify-center">
                        {getNotificationTypeBadge(notification.type)}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-main_text text-sm sm:text-base hidden sm:table-cell">
                      {formatDate(notification.created_at)}
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

export default NotificationPage;