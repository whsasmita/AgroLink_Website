import { CircleUser, MapPin, Star, ShoppingCart, ArrowLeft, Share2, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import ProductDetailSkeleton from "../../../components/compound/skeleton/ProductDetailSkeleton";
import { useNavigate, useParams } from "react-router-dom";
import { getProductsById } from "../../../services/productServices";
import { addItemToCart } from "../../../services/cartService";

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

export default function DetailProduct() {
    const [isLoading, setLoading] = useState(true);
    const [dataJson, setDataJson] = useState(null);
    const [amount, setAmount] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const { toast, showToast, closeToast } = useToast();

    useEffect(() => {
        const fetchProductById = async () => {
            try {
                const data = await getProductsById(id);
                console.log(data);
                setDataJson(data.data);
                if (data.data?.image_urls?.length > 0) {
                    setSelectedImage(data.data.image_urls[0]);
                }
                setLoading(false);
            } catch (err) {
                console.log(err);
                showToast("Gagal memuat produk.", "error");
            } finally {
                setLoading(false);
            }
        }

        fetchProductById();
    }, [id, showToast]);

    async function handleAddToCart() {
        if (amount < 1) {
            showToast("Jumlah minimal 1 kg", "error");
            return;
        }

        setIsAddingToCart(true);
        try {
            const data = await addItemToCart(id, parseInt(amount));
            console.log(data);
            showToast("Berhasil ditambahkan ke keranjang!");
        } catch (e) {
            console.error(e);
            showToast("Gagal menambahkan ke keranjang", "error");
        } finally {
            setIsAddingToCart(false);
        }
    }

    function handleBuyNow() {
        if (amount < 1) {
            showToast("Jumlah minimal 1 kg", "error");
            return;
        }

        const checkoutItem = {
            product_id: dataJson.id,
            title: dataJson.title,
            price: dataJson.price,
            quantity: amount,
            image_url: dataJson.image_urls?.[0],
            satuan: 'kg'
        };

        navigate('/checkout', {
            state: {
                checkoutItems: [checkoutItem],
                fromProduct: true
            }
        });
    }

    if (isLoading) {
        return <ProductDetailSkeleton />;
    }

    if (!dataJson) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <p className="text-lg text-gray-500">Produk tidak ditemukan.</p>
                <button onClick={() => navigate("/product")} className="mt-4 text-green-600 hover:underline">
                    Kembali ke Katalog
                </button>
            </div>
        );
    }

    return (
        <>
            {toast && (
                <ToastNotification 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={closeToast}
                />
            )}

            <div className="min-h-screen pb-32 bg-gray-50 md:pb-12">
            {/* Navbar / Header Sederhana untuk Mobile */}
            <div className="sticky top-0 z-30 bg-white border-b shadow-sm md:relative">
                <div className="container px-4 py-3 mx-auto md:py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <h1 className="text-lg font-semibold text-gray-800 md:text-xl line-clamp-1">
                                Detail Produk
                            </h1>
                        </div>
                        {/* <div className="flex gap-2">
                            <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
                                <Share2 size={22} />
                            </button>
                            <button onClick={() => navigate("/cart")} className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100">
                                <ShoppingCart size={22} />
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="container px-4 mx-auto mt-4 md:mt-8">
                {/* Breadcrumb (Desktop Only) */}
                <nav className="hidden mb-6 text-sm text-gray-500 md:block">
                    <ol className="flex items-center gap-2">
                        <li><button onClick={() => navigate("/")} className="hover:text-green-600">Beranda</button></li>
                        <li>/</li>
                        <li><button onClick={() => navigate("/product")} className="hover:text-green-600">Produk</button></li>
                        <li>/</li>
                        <li className="font-medium text-gray-900 line-clamp-1">{dataJson.title}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Kolom Kiri: Galeri Gambar */}
                    <div className="lg:col-span-5">
                        <div className="sticky space-y-4 top-24">
                            <div className="overflow-hidden bg-white border border-gray-200 rounded-xl aspect-square">
                                <img
                                    src={selectedImage || dataJson.image_urls?.[0]}
                                    alt={dataJson.title}
                                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                            {/* Thumbnail List */}
                            {dataJson.image_urls?.length > 1 && (
                                <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide">
                                    {dataJson.image_urls.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            className={`relative flex-shrink-0 w-20 h-20 overflow-hidden border-2 rounded-lg ${
                                                selectedImage === img ? "border-green-500 ring-2 ring-green-500 ring-opacity-20" : "border-transparent"
                                            }`}
                                        >
                                            <img src={img} alt={`thumb-${idx}`} className="object-cover w-full h-full" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Kolom Tengah: Info Produk */}
                    <div className="space-y-6 lg:col-span-7 xl:col-span-4">
                        <div className="p-0 bg-white rounded-none md:p-0 md:rounded-xl md:bg-transparent">
                            <h1 className="text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
                                {dataJson.title}
                            </h1>
                            
                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star fill="currentColor" size={18} />
                                    <span className="font-semibold text-gray-900 text-base pt-0.5">{dataJson.average_rating || "0.0"}</span>
                                </div>
                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                <span className="text-sm text-gray-500">Terjual {dataJson.sold_count || 0}</span>
                            </div>

                            <div className="mt-4">
                                <h2 className="text-3xl font-bold text-green-600">
                                    {PriceIDFormat(dataJson.price)}
                                    <span className="ml-1 text-base font-normal text-gray-500">/kg</span>
                                </h2>
                            </div>
                        </div>

                        {/* Info Stok & Lokasi (Card terpisah di mobile ) */}
                        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 text-green-600 rounded-full bg-green-50">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Lokasi Pengiriman</p>
                                        <p className="text-sm font-medium text-gray-900 mt-0.5">{dataJson.location || "Indonesia"}</p>
                                    </div>
                                </div>
                                <div className="hidden w-px h-10 bg-gray-200 sm:block"></div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 text-blue-600 rounded-full bg-blue-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Stok Tersedia</p>
                                        <p className="text-sm font-medium text-gray-900 mt-0.5">{dataJson.available_stock} kg</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Deskripsi */}
                        <div className="pt-4 border-t border-gray-200">
                            <h3 className="mb-3 text-lg font-semibold text-gray-900">Deskripsi Produk</h3>
                            <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap md:text-base">
                                {dataJson.description}
                            </p>
                        </div>

                        {/* Profil Penjual */}
                        <div className="pt-4 border-t border-gray-200">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Informasi Penjual</h3>
                            <div className="flex items-center p-4 transition-colors bg-white border border-gray-200 cursor-pointer rounded-xl hover:border-green-500 group">
                                <div className="flex-shrink-0">
                                    {dataJson.farmer_avatar ? (
                                        <img src={dataJson.farmer_avatar} alt={dataJson.farmer_name} className="object-cover w-12 h-12 rounded-full" />
                                    ) : (
                                        <div className="flex items-center justify-center w-12 h-12 text-gray-400 transition-colors bg-gray-100 rounded-full group-hover:bg-green-50 group-hover:text-green-600">
                                            <CircleUser size={28} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 ml-4">
                                    <h4 className="text-base font-bold text-gray-900 transition-colors group-hover:text-green-700">
                                        {dataJson.farmer_name || "Petani Agro"}
                                    </h4>
                                    <div className="flex items-center mt-1 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={12} /> {dataJson.location}
                                        </span>
                                        <span className="mx-2">•</span>
                                        <span className="font-medium text-green-600">Aktif 5 menit lalu</span>
                                    </div>
                                </div>
                                {/* <button className="text-sm font-medium text-green-600 border border-green-600 px-4 py-1.5 rounded-full hover:bg-green-50 transition-colors">
                                    Kunjungi
                                </button> */}
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Action Card (Sticky Desktop) */}
                    <div className="hidden xl:block xl:col-span-3">
                        <div className="sticky p-6 bg-white border border-gray-200 shadow-sm top-24 rounded-xl">
                            <h3 className="mb-4 text-lg font-bold text-gray-900">Atur Jumlah</h3>
                            
                            <div className="flex items-center justify-between p-3 mb-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex items-center bg-white border border-gray-300 rounded-md">
                                    <button 
                                        onClick={() => setAmount(Math.max(1, amount - 1))}
                                        className="px-3 py-1 text-gray-600 transition-colors hover:bg-gray-100"
                                    >
                                        -
                                    </button>
                                    <input 
                                        type="number" 
                                        value={amount}
                                        onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-12 py-1 text-sm font-medium text-center border-l border-r border-gray-300 focus:outline-none"
                                    />
                                    <button 
                                        onClick={() => setAmount(amount + 1)}
                                        className="px-3 py-1 text-gray-600 transition-colors hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-sm text-gray-500">
                                    Stok: <span className="font-medium text-gray-900">{dataJson.available_stock}</span>
                                </span>
                            </div>

                            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="text-xl font-bold text-gray-900">
                                    {PriceIDFormat(dataJson.price * amount)}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart}
                                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-green-600 bg-white border-2 border-green-600 hover:bg-green-50 transition-all ${isAddingToCart ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isAddingToCart ? (
                                        <span className="text-sm">Menambahkan...</span>
                                    ) : (
                                        <>
                                            <ShoppingCart size={18} />
                                            <span>Keranjang</span>
                                        </>
                                    )}
                                </button>
                                <button 
                                    onClick={handleBuyNow}
                                    className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all transform active:scale-[0.98]"
                                >
                                    Beli Sekarang
                                </button>
                            </div>
                            
                            {/* <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                                <Heart size={16} /> 
                                <span>Tambah ke Wishlist</span>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation Bar (Mobile & Tablet Only) */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] px-4 py-3 xl:hidden pb-safe">
                <div className="container max-w-4xl mx-auto">
                    <div className="flex items-center gap-3">
                        {/* Input Jumlah Compact */}
                        <div className="flex items-center border border-gray-300 rounded-lg h-11">
                            <button 
                                onClick={() => setAmount(Math.max(1, amount - 1))}
                                className="h-full px-3 text-gray-500 rounded-l-lg hover:bg-gray-50"
                            >
                                -
                            </button>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-10 h-full text-sm font-medium text-center border-gray-300 border-x focus:outline-none"
                            />
                            <button 
                                onClick={() => setAmount(amount + 1)}
                                className="h-full px-3 text-gray-500 rounded-r-lg hover:bg-gray-50"
                            >
                                +
                            </button>
                        </div>

                        {/* Tombol Aksi */}
                        <button 
                            onClick={handleAddToCart}
                            disabled={isAddingToCart}
                            className="flex flex-col items-center justify-center flex-1 text-sm font-medium text-green-600 bg-white border border-green-600 rounded-lg h-11 active:bg-green-50"
                        >
                            <ShoppingCart size={18} />
                        </button>
                        <button 
                            onClick={handleBuyNow}
                            className="flex-[2] h-11 rounded-lg bg-green-600 text-white font-semibold text-sm shadow-md active:bg-green-700"
                        >
                            Beli Sekarang
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}