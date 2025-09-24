import { useState } from "react";
import { MdSearch, MdStar, MdStarBorder } from "react-icons/md";

const ReviewPage = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  
  // Empty reviews array - replace with actual data from your API
  const reviews = [];

  // Filter reviews based on search term
  const filteredReviews = reviews.filter((review) =>
    review.project_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.reviewer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render star rating
  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <MdStar key={i} size={16} className="text-yellow-400" />
        ) : (
          <MdStarBorder key={i} size={16} className="text-gray-300" />
        )
      );
    }
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  return (
    <div className="p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row bg-white rounded-lg shadow-sm p-4 justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-main mb-2">
            Ulasan
          </h1>
          <p className="text-main_text text-sm sm:text-base">
            Lihat ulasan dan rating dari klien
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
              placeholder="Cari ulasan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-4">
              <MdStar size={64} className="text-gray-300 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {reviews.length === 0
                ? "Belum Ada Ulasan"
                : "Tidak Ada Data yang Sesuai"}
            </h3>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">
              {reviews.length === 0
                ? "Ulasan dari klien akan muncul di sini setelah proyek selesai."
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
                    Proyek
                  </th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base hidden sm:table-cell">
                    Klien
                  </th>
                  <th className="text-center px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base">
                    Rating
                  </th>
                  <th className="text-left px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-sm sm:text-base hidden lg:table-cell">
                    Komentar
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review, index) => (
                  <tr
                    key={review.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-main_text text-sm sm:text-base">
                      {index + 1}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm sm:text-base break-words">
                          {review.project_title}
                        </p>
                        <div className="sm:hidden text-xs text-gray-500 mt-1">
                          {review.reviewer_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-main_text text-sm sm:text-base hidden sm:table-cell">
                      {review.reviewer_name}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex flex-col items-center gap-1">
                        {renderStarRating(review.rating)}
                        <span className="text-xs text-gray-500">
                          {review.rating}/5
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-main_text text-sm sm:text-base hidden lg:table-cell max-w-xs">
                      <p className="truncate" title={review.comment}>
                        {review.comment}
                      </p>
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

export default ReviewPage;