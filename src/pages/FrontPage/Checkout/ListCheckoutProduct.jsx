import { useEffect, useState } from "react";
import logoImage from "../../../assets/images/Logo.png";
import agrolinkText from "../../../assets/images/agrolink.png"
import { useLocation, useNavigate } from "react-router-dom";

function PriceIDFormat(price){
    const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);

    return formatted;
}

export default function ListCheckoutProduct(){
    const location = useLocation();
    const navigate = useNavigate();
    const { checkoutItems } = location.state || {};
    const [items, setItems] = useState(checkoutItems || []);
    const userData = localStorage.getItem('token');

    useEffect(() => {
        if (!userData) {
            navigate("/auth/login", { replace: true });
        }
    }, [userData, navigate]);

    useEffect(() => {
        console.log("Data checkout items: ", checkoutItems);
        
        // Jika tidak ada data checkout items, redirect kembali ke cart
        if (!checkoutItems || checkoutItems.length === 0) {
            alert("Tidak ada item untuk checkout");
            navigate("/cart", { replace: true });
        }
    }, [checkoutItems, navigate]);

    // Fungsi untuk update quantity item
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

    // Hitung total (tanpa diskon)
    const subtotalProduk = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const ppn = subtotalProduk * 0.11;
    const grandTotal = subtotalProduk + ppn;

    return (
        <>
            <nav className="fixed flex justify-between top-0 left-0 right-0 z-50 bg-white h-[60px] md:h-[80px] shadow-md px-3 md:px-6">
                <div className="flex items-center h-full space-x-2 md:space-x-3">
                    <img src={logoImage} alt="logo" className="w-6 h-6 md:w-8 md:h-8" />
                    <img src={agrolinkText} alt="logo-text" className="h-3 w-20 md:h-4 md:w-28" />
                </div>
                <div className="flex items-center h-full">
                    <button onClick={() => navigate(-1)} className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base text-white bg-red-500 rounded-md hover:bg-red-600">
                        Batal
                    </button>
                </div>
            </nav>
            
            <div className="grid w-full min-h-screen grid-cols-1 lg:grid-cols-3 pb-20 lg:pb-0">
                {/* Section Detail Order */}
                <div className="lg:col-span-2 pt-[80px] md:pt-[100px] px-4 md:px-8">
                    <h1 className="text-xl md:text-2xl font-semibold text-center mb-4">Pembelian</h1>
                    <div className="max-w-4xl mx-auto">
                        {/* Alamat */}
                        <div className="mb-5">
                            <h3 className="text-sm md:text-base font-medium mb-2">Alamat</h3>
                            <div className="w-full px-4 md:px-5 py-2 border rounded-md text-sm md:text-base">
                                Rumah
                            </div>
                        </div>

                        {/* Detail Order */}
                        <div>
                            <h3 className="text-sm md:text-base font-medium mb-2">Detail Order</h3>
                            <div className="space-y-3">
                                {items.map((item, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row sm:justify-between gap-3 px-3 md:px-4 py-3 border rounded-md">
                                        {/* Product Info */}
                                        <div className="flex items-center space-x-3">
                                            {item.image_url && (
                                                <img 
                                                    src={item.image_url} 
                                                    alt={item.title} 
                                                    className="object-cover w-12 h-12 md:w-16 md:h-16 rounded-md flex-shrink-0"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm md:text-base truncate">{item.title}</div>
                                                <div className="text-xs md:text-sm text-gray-600">
                                                    {PriceIDFormat(item.price)}/{item.satuan || 'unit'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price & Quantity Controls */}
                                        <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                                            <div className="text-right">
                                                <div className="text-xs md:text-sm text-gray-600">Subtotal</div>
                                                <div className="font-semibold text-sm md:text-base">
                                                    {PriceIDFormat(item.price * item.quantity)}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)} 
                                                    disabled={item.quantity === 1}
                                                    className={`flex items-center justify-center w-6 h-6 md:w-7 md:h-7 text-white rounded-md ${
                                                        item.quantity === 1 
                                                            ? 'bg-gray-300 cursor-not-allowed' 
                                                            : 'bg-green-500 hover:bg-green-600'
                                                    }`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                                                </button>
                                                <span className="w-6 md:w-8 text-center text-sm md:text-base">
                                                    {item.quantity}
                                                </span>
                                                <button 
                                                    onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)} 
                                                    className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 text-white bg-green-500 rounded-md hover:bg-green-600"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary dalam Detail Order (Mobile Only) */}
                            <div className="mt-4 lg:hidden">
                                <div className="w-full h-px bg-slate-300 my-3"></div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Subtotal Produk</span>
                                        <span>{PriceIDFormat(subtotalProduk)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>PPN 11%</span>
                                        <span>{PriceIDFormat(ppn)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Rangkuman Order (Desktop: Sidebar, Mobile: Bottom Fixed) */}
                <div className="hidden lg:block bg-gray-300 pt-[100px] px-4">
                    <div className="max-w-md mx-auto">
                        <h1 className="text-xl md:text-2xl font-semibold text-center mb-5">Rangkuman Order</h1>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <th className="pr-8 font-normal text-start text-sm md:text-base py-2">Subtotal produk</th>
                                        <th className="text-right text-sm md:text-base">{PriceIDFormat(subtotalProduk)}</th>
                                    </tr>
                                    <tr>
                                        <th className="pr-8 font-normal text-start text-sm md:text-base py-2">PPN 11%</th>
                                        <th className="text-right text-sm md:text-base">{PriceIDFormat(ppn)}</th>
                                    </tr>
                                    <tr className="border-t-2 border-black">
                                        <th className="pr-8 font-normal text-start text-sm md:text-base py-2">Total</th>
                                        <th className="text-right text-sm md:text-base">{PriceIDFormat(grandTotal)}</th>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="mt-6">
                                <button className="w-full py-2.5 text-sm md:text-base text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors">
                                    Beli Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Fixed Summary (Mobile Only) */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-40">
                    <div className="px-4 py-3">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <div className="text-xs text-gray-600">Total Pembayaran</div>
                                <div className="text-lg font-bold text-green-600">{PriceIDFormat(grandTotal)}</div>
                            </div>
                            <button className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors">
                                Beli Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}