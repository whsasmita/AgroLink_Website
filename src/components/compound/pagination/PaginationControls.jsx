import React from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5; 
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            {/* Tombol Sebelumnya */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 transition-colors duration-200 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
            >
                <MdChevronLeft size={20} />
            </button>

            {/* Nomor Halaman */}
            <div className="flex gap-1 mx-2">
                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-100"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="flex items-center justify-center w-8 h-8 text-gray-500">...</span>}
                    </>
                )}

                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => onPageChange(number)}
                        className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md shadow-sm border ${
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
                        {endPage < totalPages - 1 && <span className="flex items-center justify-center w-8 h-8 text-gray-500">...</span>}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className="flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-100"
                        >
                            {totalPages}
                        </button>
                    </>
                )}
            </div>

            {/* Tombol Berikutnya */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-600 transition-colors duration-200 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
            >
                <MdChevronRight size={20} />
            </button>
        </div>
    );
};

export default PaginationControls;