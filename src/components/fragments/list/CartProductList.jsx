import { useState, useEffect } from "react";
import { updateCartItem } from "../../../services/cartService";
import { Trash2, Minus, Plus, X } from 'lucide-react'; 
import { useToast } from "../../../services/useToast"; 
import ToastNotification from "../../fragments/toast/ToastNotification"; 

// --- TAMBAHAN: Komponen Modal Konfirmasi ---
// Disalin dari CartProduct.jsx untuk konfirmasi hapus
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl">
                <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="p-1 text-gray-400 rounded-full hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                        Ya, Hapus
                    </button>
                </div>
            </div>
        </div>
    );
};
// --- AKHIR TAMBAHAN ---


// Helper Format Harga
function PriceIDFormat(price) {
    const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);
    return formatted;
}

export default function CartProductList({
    id, 
    name, 
    amount, 
    price, 
    image, 
    isChecked, 
    onChecked, 
    onDelete,
    onUpdate
}) {
    const [quantity, setQuantity] = useState(amount);
    const [isUpdating, setIsUpdating] = useState(false);
    
    // --- TAMBAHAN: State untuk Modal & Toast ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { toast, showToast, closeToast } = useToast();
    // --- AKHIR TAMBAHAN ---

    useEffect(() => {
        setQuantity(amount);
    }, [amount]);

    // --- MODIFIKASI: Logika Update Kuantitas ---
    async function handleUpdateQuantity(newAmount) {
        // Jika jumlah baru < 1, buka modal konfirmasi
        if (newAmount < 1) {
            setIsDeleteModalOpen(true); 
            return;
        }

        setIsUpdating(true);
        try {
            await updateCartItem(id, newAmount);
            setQuantity(newAmount);
            onUpdate(id, newAmount); 
        } catch (err) {
            console.error(err);
            // Ganti alert dengan toast
            showToast("Gagal mengupdate jumlah", "error"); 
        } finally {
            setIsUpdating(false);
        }
    }

    // --- TAMBAHAN: Fungsi untuk mengeksekusi hapus ---
    // Dipanggil oleh modal
    const executeDelete = () => {
        setIsDeleteModalOpen(false);
        onDelete(id); // Panggil fungsi delete dari parent
    };
    // --- AKHIR TAMBAHAN ---

    function handleCheckboxChange(e) {
        onChecked(id, e.target.checked);
    }

    return (
        <>
            {/* Render Toast (akan muncul jika 'toast' tidak null) */}
            {toast && (
                <ToastNotification 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={closeToast}
                />
            )}
        
            {/* Tampilan item keranjang */}
            <div className="flex items-start w-full p-4 space-x-4 bg-white rounded-lg shadow-sm">
                <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 mt-1 border-gray-300 rounded text-green-600 focus:ring-green-500 flex-shrink-0" 
                />
                
                <div
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-cover bg-center rounded-md flex-shrink-0"
                    style={{ backgroundImage: `url(${image})` }}
                ></div>

                <div className="flex-1 min-w-0">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">
                        {name}
                    </h2>
                    <p className="text-xs text-gray-500 sm:text-sm mt-1">
                        {PriceIDFormat(price)} / kg
                    </p>
                    <p className="text-base sm:text-lg font-bold text-green-600 mt-2 sm:mt-3">
                        {PriceIDFormat(price * quantity)}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-300 rounded-md bg-white">
                            <button 
                                onClick={() => handleUpdateQuantity(quantity - 1)}
                                disabled={isUpdating}
                                className="px-2 py-1 text-gray-600 transition-colors rounded-l-md sm:px-3 sm:py-1.5 hover:bg-gray-100 disabled:opacity-50"
                                aria-label="Kurangi jumlah"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="px-2 py-1 text-sm font-medium text-center border-l border-r border-gray-300 sm:px-4 sm:py-1.5 min-w-[40px]">
                                {isUpdating ? '...' : quantity}
                            </span>
                            <button 
                                onClick={() => handleUpdateQuantity(quantity + 1)}
                                disabled={isUpdating}
                                className="px-2 py-1 text-gray-600 transition-colors rounded-r-md sm:px-3 sm:py-1.5 hover:bg-gray-100 disabled:opacity-50"
                                aria-label="Tambah jumlah"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        {/* --- MODIFIKASI: Tombol Hapus --- */}
                        <button
                            onClick={() => setIsDeleteModalOpen(true)} // Buka modal
                            disabled={isUpdating}
                            className="p-2 text-gray-400 transition-colors rounded-full hover:bg-red-50 hover:text-red-500"
                            aria-label="Hapus item"
                        >
                            <Trash2 size={18} />
                        </button>
                        {/* --- AKHIR MODIFIKASI --- */}
                    </div>
                </div>
            </div>

            {/* --- TAMBAHAN: Render Modal --- */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={executeDelete} // Panggil fungsi executeDelete
                title="Hapus Item"
                message={`Anda yakin ingin menghapus "${name}" dari keranjang?`}
            />
            {/* --- AKHIR TAMBAHAN --- */}
        </>
    );
}