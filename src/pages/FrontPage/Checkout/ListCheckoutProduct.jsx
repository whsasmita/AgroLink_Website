import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Ticket, CreditCard, ChevronUp } from "lucide-react";
import ToastNotification from '../../../components/fragments/toast/ToastNotification'; 
import { useToast } from '../../../services/useToast'; 

function PriceIDFormat(price) {
    const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);
    return formatted;
}

const CheckoutItemCard = ({ item, onQuantityChange }) => {
    return (
        <div className="flex gap-4 py-4 border-b border-gray-100">
            <img 
                src={item.image_url} 
                alt={item.title} 
                className="object-cover w-20 h-20 border border-gray-100 rounded-lg"
            />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {item.title}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                    {PriceIDFormat(item.price)} / {item.satuan || 'kg'}
                </p>
                {/* Kontrol Kuantitas */}
                <div className="flex items-center justify-between mt-3">
                    <p className="text-sm font-bold text-green-600">
                        {PriceIDFormat(item.price * item.quantity)}
                    </p>
                    <div className="flex items-center border border-gray-200 rounded-md">
                        <button 
                            onClick={() => onQuantityChange(item.product_id, item.quantity - 1)} 
                            disabled={item.quantity === 1}
                            className="px-2 py-1 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            -
                        </button>
                        <span className="px-3 text-sm font-medium border-gray-200 border-x">
                            {item.quantity}
                        </span>
                        <button 
                            onClick={() => onQuantityChange(item.product_id, item.quantity + 1)} 
                            className="px-2 py-1 text-gray-500 hover:bg-gray-50"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function ListCheckoutProduct() {
    const location = useLocation();
    const navigate = useNavigate();
    const { checkoutItems } = location.state || {};
    
    const [items, setItems] = useState(checkoutItems || []);
    const [paymentMethod, setPaymentMethod] = useState("qris");
    const { toast, showToast, closeToast } = useToast(); 

    const [userAddress, setUserAddress] = useState("Jl. Raya Seminyak No.1, Kuta, Bali, 80361");
    const [userName, setUserName] = useState("John Doe");
    const [userPhone, setUserPhone] = useState("081234567890");
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate("/auth/login", { replace: true });
        }
        
        if (!checkoutItems || checkoutItems.length === 0) {
            showToast("Tidak ada item untuk checkout", "error");
            navigate("/cart", { replace: true });
        }
    }, [checkoutItems, navigate, showToast]);

    function handleQuantityChange(productId, newQuantity) {
        if (newQuantity < 1) return;
        
        setItems(prevItems => 
            prevItems.map(item => 
                item.product_id === productId 
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    }

    const subtotalProduk = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const ppn = subtotalProduk * 0.11;
    const shippingCost = 15000; 
    const grandTotal = subtotalProduk + ppn + shippingCost;

    const handlePlaceOrder = () => {
        console.log("Order placed with:", items, "Payment:", paymentMethod);
        showToast("Pesanan berhasil dibuat!", "success");
        // Redirect ke halaman status pesanan setelah berhasil
        // navigate("/order/status/12345");
    };

    return (
        <>
            {/* Render Toast Notifikasi */}
            {toast && (
                <ToastNotification 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={closeToast}
                />
            )}

            <div className="min-h-screen bg-gray-50">
                {/* Header Halaman */}
                <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
                    <div className="container px-4 py-4 mx-auto md:py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => navigate(-1)} 
                                    className="p-2 text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                                <h1 className="text-xl font-bold text-gray-800">
                                    Checkout
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Konten Utama */}
                <div className="container px-4 mx-auto mt-6 mb-32 lg:mt-8 lg:mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
                        
                        {/* Kolom Kiri: Detail Alamat & Item */}
                        <div className="space-y-6 lg:col-span-8">
                            
                            <div className="p-5 bg-white border border-gray-100 rounded-lg shadow-sm">
                                <h2 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800">
                                    <MapPin size={20} className="text-green-600" />
                                    Alamat Pengiriman
                                </h2>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p className="font-semibold text-gray-900">{userName}</p>
                                    <p>{userPhone}</p>
                                    <p>{userAddress}</p>
                                </div>
                                <button className="mt-4 text-sm font-medium text-green-600 hover:underline">
                                    Ganti Alamat
                                </button>
                            </div>

                            <div className="p-5 bg-white border border-gray-100 rounded-lg shadow-sm">
                                <h2 className="mb-2 text-lg font-semibold text-gray-800">
                                    Produk Dipesan
                                </h2>
                                <div className="space-y-2">
                                    {items.map((item) => (
                                        <CheckoutItemCard 
                                            key={item.product_id} 
                                            item={item} 
                                            onQuantityChange={handleQuantityChange} 
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* <div className="p-5 bg-white border border-gray-100 rounded-lg shadow-sm lg:hidden">
                                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                                    Metode Pembayaran
                                </h2>
                                <div className="space-y-3">
                                    
                                    <button 
                                        onClick={() => setPaymentMethod('qris')}
                                        className={`w-full flex items-center p-3 border rounded-lg transition-all ${paymentMethod === 'qris' ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-200'}`}
                                    >
                                        <CreditCard size={20} className="mr-3 text-green-600" />
                                        <span className="text-sm font-medium">QRIS</span>
                                        <div className={`w-4 h-4 rounded-full border-2 ml-auto ${paymentMethod === 'qris' ? 'bg-green-500 border-white ring-2 ring-green-500' : 'bg-gray-100'}`}></div>
                                    </button>
                                    <button 
                                        onClick={() => setPaymentMethod('cod')}
                                        className={`w-full flex items-center p-3 border rounded-lg transition-all ${paymentMethod === 'cod' ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-200'}`}
                                    >
                                        <span className="mr-3 text-xl">👋</span>
                                        <span className="text-sm font-medium">Bayar di Tempat (COD)</span>
                                        <div className={`w-4 h-4 rounded-full border-2 ml-auto ${paymentMethod === 'cod' ? 'bg-green-500 border-white ring-2 ring-green-500' : 'bg-gray-100'}`}></div>
                                    </button>
                                </div>
                            </div> */}
                        </div>

                        {/* Kolom Kanan: Ringkasan Pembayaran (Sticky Desktop) */}
                        <div className="hidden lg:block lg:col-span-4">
                            <div className="sticky p-6 space-y-5 bg-white border border-gray-100 rounded-lg shadow-sm top-24">

                                {/* <div>
                                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                                        Metode Pembayaran
                                    </h2>
                                    <div className="space-y-3">
                                        <button 
                                            onClick={() => setPaymentMethod('qris')}
                                            className={`w-full flex items-center p-3 border rounded-lg transition-all ${paymentMethod === 'qris' ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-200'}`}
                                        >
                                            <CreditCard size={20} className="mr-3 text-green-600" />
                                            <span className="text-sm font-medium">QRIS</span>
                                            <div className={`w-4 h-4 rounded-full border-2 ml-auto ${paymentMethod === 'qris' ? 'bg-green-500 border-white ring-2 ring-green-500' : 'bg-gray-100'}`}></div>
                                        </button>
                                        <button 
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`w-full flex items-center p-3 border rounded-lg transition-all ${paymentMethod === 'cod' ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-200'}`}
                                        >
                                            <span className="mr-2 text-xl">👋</span>
                                            <span className="text-sm font-medium">Bayar di Tempat</span>
                                            <div className={`w-4 h-4 rounded-full border-2 ml-auto ${paymentMethod === 'cod' ? 'bg-green-500 border-white ring-2 ring-green-500' : 'bg-gray-100'}`}></div>
                                        </button>
                                    </div>
                                </div> */}

                                {/* Voucher */}
                                {/* <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <Ticket size={20} className="text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700">Punya voucher?</span>
                                    </div>
                                    <span className="text-sm font-semibold text-green-600">Pilih</span>
                                </div> */}

                                {/* Ringkasan Biaya */}
                                <div>
                                    <h2 className="pt-4 mb-4 text-lg font-semibold text-gray-800 border-gray-100">
                                        Ringkasan Pembayaran
                                    </h2>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal Produk</span>
                                            <span className="font-medium text-gray-900">{PriceIDFormat(subtotalProduk)}</span>
                                        </div>
                                        {/* <div className="flex justify-between text-gray-600">
                                            <span>Biaya Pengiriman</span>
                                            <span className="font-medium text-gray-900">{PriceIDFormat(shippingCost)}</span>
                                        </div> */}
                                        {/* <div className="flex justify-between text-gray-600">
                                            <span>PPN (11%)</span>
                                            <span className="font-medium text-gray-900">{PriceIDFormat(ppn)}</span>
                                        </div> */}
                                    </div>
                                </div>

                                {/* Total & Tombol Bayar */}
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-base font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-green-600">
                                            {PriceIDFormat(grandTotal)}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={handlePlaceOrder}
                                        className="w-full py-3 font-semibold text-white transition-colors bg-green-600 rounded-lg shadow-md hover:bg-green-700"
                                    >
                                        Buat Pesanan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bayar (Sticky Mobile) */}
                <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t-2 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.08)] lg:hidden pb-safe">
                    <div className="container px-4 py-3 mx-auto">
                        
                        {isSummaryExpanded && (
                            <div className="pb-3 mb-3 border-b border-gray-200 animate-slide-in-down">
                                <h4 className="mb-2 text-sm font-semibold text-gray-800">Ringkasan Pembayaran</h4>
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal Produk</span>
                                        <span className="font-medium text-gray-900">{PriceIDFormat(subtotalProduk)}</span>
                                    </div>
                                    {/* <div className="flex justify-between text-gray-600">
                                        <span>Biaya Pengiriman</span>
                                        <span className="font-medium text-gray-900">{PriceIDFormat(shippingCost)}</span>
                                    </div> */}
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
                                    <span className="block text-xs text-gray-500">Total Pembayaran</span>
                                    <span className="block text-xl font-bold text-green-600">
                                        {PriceIDFormat(grandTotal)}
                                    </span>
                                </div>
                                {/* Tombol Toggle Rincian */}
                                <button 
                                    onClick={() => setIsSummaryExpanded(!isSummaryExpanded)} 
                                    className="p-1 ml-1 text-gray-500 rounded-full hover:bg-gray-100"
                                >
                                    <ChevronUp 
                                        size={18} 
                                        className={`transition-transform duration-200 ${isSummaryExpanded ? 'rotate-180' : ''}`} 
                                    />
                                </button>
                            </div>
                            <button 
                                onClick={handlePlaceOrder}
                                className="px-6 py-3 text-sm font-semibold text-white transition-all bg-green-600 rounded-lg shadow-md sm:px-8 sm:text-base hover:bg-green-700 active:scale-95"
                            >
                                Buat Pesanan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}