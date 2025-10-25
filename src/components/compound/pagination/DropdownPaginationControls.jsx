import React from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

// Opsi default untuk dropdown
const DEFAULT_PAGINATION_OPTIONS = [10, 20, 50, 100];

/**
 * Komponen paginasi modern yang dapat digunakan kembali.
 *
 * @param {object} props
 * @param {number} props.currentPage 
 * @param {number} props.totalPages 
 * @param {function(number): void} props.onPageChange 
 * @param {number} [props.itemsPerPage] 
 * @param {function(Event): void} [props.onItemsPerPageChange] 
 * @param {number[]} [props.paginationOptions] 
 * @param {number} [props.totalItems] 
 * @param {string} [props.itemType="items"] 
 */
const DropdownPaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  paginationOptions = DEFAULT_PAGINATION_OPTIONS,
  totalItems,
  itemType = "items"
}) => {
  
  
  if (totalPages <= 1) return null;

  // --- Logika untuk membuat tombol nomor halaman ---
  const pageNumbers = [];

  const maxPagesToShow = 3; 
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  // --- Akhir Logika ---

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-4 px-4 py-3 border-t border-gray-200 sm:flex-row sm:px-6">
      
      <div className="flex items-center gap-4">
        
        {itemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Tampilkan</span>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={onItemsPerPageChange}
              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
            >
              {paginationOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <span>data</span>
          </div>
        )}
        
        
        {totalItems !== undefined && (
          <div className="hidden text-sm text-gray-600 lg:block">
            Total <span className="font-semibold text-gray-800">{totalItems}</span> {itemType}
          </div>
        )}
      </div>

      
      <nav className="flex items-center gap-1.5">
        {/* Tombol 'Sebelumnya' */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 text-gray-600 transition-colors duration-200 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Halaman sebelumnya"
        >
          <MdChevronLeft size={20} />
        </button>

        
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-100"
              aria-label="Halaman 1"
            >
              1
            </button>
            {startPage > 2 && <span className="flex items-center justify-center w-8 h-8 text-sm text-gray-500">...</span>}
          </>
        )}

        {/* Tombol Nomor Halaman */}
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`flex items-center justify-center w-8 h-8 text-sm font-medium rounded-md shadow-sm border ${
              currentPage === number
                ? 'bg-main text-white border-main'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
            } transition-colors duration-200`}
            aria-current={currentPage === number ? 'page' : undefined}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="flex items-center justify-center w-8 h-8 text-sm text-gray-500">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-100"
              aria-label={`Halaman ${totalPages}`}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Tombol 'Berikutnya' */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-600 transition-colors duration-200 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Halaman berikutnya"
        >
          <MdChevronRight size={20} />
        </button>
      </nav>
    </div>
  );
};

export default DropdownPaginationControls;