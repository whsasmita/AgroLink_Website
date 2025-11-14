import { useEffect, useState } from "react";
import { getCartItems, removeItemFromCart } from "../../../services/cartService";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Trash2, X, ChevronUp } from "lucide-react";
import ToastNotification from '../../../components/fragments/toast/ToastNotification'; 
import { useToast } from '../../../services/useToast'; 
import CartProductList from "../../../components/fragments/list/CartProductList"; 

// --- Komponen Modal Konfirmasi ---
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

// --- Helper Format Harga ---
function PriceIDFormat(price) {
    const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);
    return formatted;
}

export default function CartProduct() {
    const navigate = useNavigate();
    const [dataCart, setDataCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast, showToast, closeToast } = useToast();
    const [showMobileSummary, setShowMobileSummary] = useState(false);
    
    // State untuk modal konfirmasi
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        fetchCartData();
    }, []);

    async function fetchCartData() {
        try {
            const response = await getCartItems();
            if (Array.isArray(response?.data?.items)) {
                setDataCart(response.data.items);
            } else {
                setDataCart([]);
            }
        } catch (err) {
            console.error(err);
            setDataCart([]);
            showToast("Gagal memuat keranjang.", "error");
        } finally {
            setIsLoading(false);
        }
    }

    function handleCheckItem(productId, isChecked) {
        if (isChecked) {
            setSelectedItems([...selectedItems, productId]);
        } else {
            setSelectedItems(selectedItems.filter(id => id !== productId));
        }
    }

    function handleSelectAll(isChecked) {
        if (isChecked) {
            setSelectedItems(dataCart.map(item => item.product_id));
        } else {
            setSelectedItems([]);
        }
    }

    function handleDeleteSelected() {
        if (selectedItems.length === 0) {
            showToast("Pilih item yang ingin dihapus", "error"); 
            return;
        }
        setIsDeleteModalOpen(true); 
    }

    async function executeDeleteSelected() {
        setIsDeleteModalOpen(false); 
        setIsDeleting(true);
        
        try {
            const deletePromises = selectedItems.map(productId => 
                removeItemFromCart(productId)
            );
            await Promise.all(deletePromises);
            
            setSelectedItems([]);
            await fetchCartData();
            showToast("Item yang dipilih berhasil dihapus", "success");
        } catch (err) {
            console.error(err);
            showToast("Gagal menghapus beberapa item", "error");
        } finally {
            setIsDeleting(false);
        }
    }

    async function handleItemDeleted(productId) {
        try {
            await removeItemFromCart(productId);
            await fetchCartData();
            showToast("Item berhasil dihapus", "success");
        } catch (err) {
            console.error(err);
            showToast("Gagal menghapus item", "error");
        }
    }

    function handleItemUpdated(productId, newQuantity) {
        setDataCart(prevCart => 
            prevCart.map(item => 
                item.product_id === productId 
                    ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity }
                    : item
            )
        );
    }

    function handleCheckout() {
        if (selectedItems.length === 0) {
            showToast("Pilih item yang ingin dibeli", "error");
            return;
        }
        const selectedCartItems = dataCart.filter(item => 
            selectedItems.includes(item.product_id)
        );
        navigate("/checkout", {
            state: { checkoutItems: selectedCartItems }
        });
    }

    const subtotal = dataCart
        .filter(item => selectedItems.includes(item.product_id))
        .reduce((total, item) => total + (item.price * item.quantity), 0);
    
    const ppn = subtotal * 0.11;
    const grandTotal = subtotal + ppn;

    const allItemsSelected = dataCart.length > 0 && selectedItems.length === dataCart.length;

    // --- JSX (Tampilan) ---
    return (
        <>

            {toast && (
                <ToastNotification 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={closeToast}
                />
            )}
        
            <div className="min-h-screen pb-32 bg-gray-50 lg:pb-12">
                {/* Header Halaman */}
                <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
                    <div className="container px-4 py-4 mx-auto">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => navigate(-1)} 
                                className="p-2 text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <h1 className="text-xl font-bold text-gray-800">
                                Keranjang Saya
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Konten Utama */}
                <div className="container px-4 mx-auto mt-6 lg:mt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
                        
                        {/* Kolom Kiri: Daftar Item */}
                        <div className="lg:col-span-8">
                            {/* Header Aksi (Pilih Semua / Hapus) */}
                            <div className="flex items-center justify-between p-4 mb-4 bg-white rounded-lg shadow-sm">
                                <div className="flex items-center gap-3">
                                    <input 
                                        id="selectAll" 
                                        type="checkbox"
                                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                        checked={allItemsSelected}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        disabled={dataCart.length === 0}
                                    />
                                    <label htmlFor="selectAll" className="text-sm font-medium text-gray-700">
                                        Pilih Semua ({dataCart.length} item)
                                    </label>
                                </div>
                                <button
                                    onClick={handleDeleteSelected}
                                    disabled={isDeleting || selectedItems.length === 0}
                                    className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Trash2 size={16} />
                                    {isDeleting ? 'Menghapus...' : 'Hapus'}
                                </button>
                            </div>

                            {/* Status Loading */}
                            {isLoading && (
                                <div className="flex items-center justify-center p-16 bg-white rounded-lg shadow-sm">
                                    <p className="text-gray-500">Memuat keranjang...</p>
                                </div>
                            )}

                            {/* Status Kosong */}
                            {!isLoading && dataCart.length === 0 && (
                                <div className="flex flex-col items-center justify-center p-16 text-gray-400 bg-white rounded-lg shadow-sm">
                                    <ShoppingCart size={48} className="mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-700">Keranjang Anda Kosong</h3>
                                    <p className="text-sm">Ayo, cari produk terbaik!</p>
                                    <button 
                                        onClick={() => navigate('/product')}
                                        className="px-6 py-2 mt-6 font-semibold text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700"
                                    >
                                        Mulai Belanja
                                    </button>
                                </div>
                            )}

                            {/* Daftar Item */}
                            {!isLoading && dataCart.length > 0 && (
                                <div className="space-y-4">
                                    {dataCart.map((item) => (
                                        <CartProductList 
                                            key={item.product_id}
                                            id={item.product_id} 
                                            amount={item.quantity} 
                                            image={item.image_url} 
                                            name={item.title} 
                                            price={item.price} 
                                            isChecked={selectedItems.includes(item.product_id)}
                                            onChecked={handleCheckItem}
                                            onDelete={handleItemDeleted} 
                                            onUpdate={handleItemUpdated}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Kolom Kanan: Ringkasan (Hanya Desktop) */}
                        <div className="hidden lg:block lg:col-span-4">
                            <div className="sticky p-6 bg-white rounded-lg shadow-sm top-24">
                                <h2 className="pb-4 text-xl font-bold text-gray-800 border-b">
                                    Ringkasan Belanja
                                </h2>
                                
                                <div className="mt-4 space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({selectedItems.length} item)</span>
                                        <span className="font-medium text-gray-900">{PriceIDFormat(subtotal)}</span>
                                    </div>
                                    {/* <div className="flex justify-between text-gray-600">
                                        <span>PPN (11%)</span>
                                        <span className="font-medium text-gray-900">{PriceIDFormat(ppn)}</span>
                                    </div> */}
                                </div>

                                <div className="flex items-center justify-between pt-4 mt-6 border-t">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-green-600">{PriceIDFormat(grandTotal)}</span>
                                </div>

                                <button 
                                    onClick={handleCheckout}
                                    disabled={selectedItems.length === 0}
                                    className={`w-full mt-6 py-3 text-white font-semibold rounded-lg shadow-md transition-colors ${
                                        selectedItems.length === 0 
                                        ? 'bg-gray-300 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700'
                                    }`}
                                >
                                    Beli ({selectedItems.length})
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Footer Checkout (Hanya Mobile) --- */}
                <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t-2 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.08)] lg:hidden pb-safe">
                    <div className="container px-4 py-3 mx-auto">
                        
                        {showMobileSummary && (
                            <div className="pb-3 mb-3 border-b border-gray-200 animate-slide-in-down">
                                <h4 className="mb-2 text-sm font-semibold text-gray-800">Ringkasan Belanja</h4>
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({selectedItems.length} item)</span>
                                        <span className="font-medium text-gray-900">{PriceIDFormat(subtotal)}</span>
                                    </div>
                                    {/* <div className="flex justify-between text-gray-600">
                                        <span>PPN (11%)</span>
                                        <span className="font-medium text-gray-900">{PriceIDFormat(ppn)}</span>
                                    </div> */}
                                </div>
                            </div>
                        )}
                        
                        {/* Baris Aksi Utama */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div>
                                    <span className="block text-xs text-gray-500">Total Harga</span>
                                    <span className="block text-xl font-bold text-green-600">
                                        {PriceIDFormat(grandTotal)}
                                    </span>
                                </div>
                                {/* Tombol Toggle Rincian */}
                                <button 
                                    onClick={() => setShowMobileSummary(!showMobileSummary)} 
                                    className="p-1 ml-1 text-gray-500 rounded-full hover:bg-gray-100"
                                >
                                    <ChevronUp 
                                        size={18} 
                                        className={`transition-transform duration-200 ${showMobileSummary ? 'rotate-180' : ''}`} 
                                    />
                                </button>
                            </div>
                            <button 
                                onClick={handleCheckout}
                                disabled={selectedItems.length === 0}
                                className={`px-6 py-3 text-white font-semibold rounded-lg shadow-md transition-colors ${
                                    selectedItems.length === 0 
                                    ? 'bg-gray-300 cursor-not-allowed' 
                                    : 'bg-green-600 hover:bg-green-700 active:scale-95'
                                }`}
                            >
                                Beli ({selectedItems.length})
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>

            {/* Modal Konfirmasi Hapus */}
            <ConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={executeDeleteSelected}
                title="Hapus Item"
                message={`Anda yakin ingin menghapus ${selectedItems.length} item yang dipilih dari keranjang?`}
            />
        </>
    );
}