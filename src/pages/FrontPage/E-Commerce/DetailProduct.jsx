import { CircleUser, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import ProductDetailSkeleton from "../../../components/compound/skeleton/ProductDetailSkeleton";
import { useNavigate, useParams } from "react-router-dom";
import { getProductsById } from "../../../services/productServices";
import { addItemToCart } from "../../../services/cartService";

function PriceIDFormat(price){
    const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);

    return formatted;
}

export default function DetailProduct(){
    const [isLoading, setLoading] = useState(true);
    const [dataJson, setDataJson] = useState(null);
    const [amount, setAmount] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductById = async () => {
            try {
                const data = await getProductsById(id);
                console.log(data);
                setDataJson(data.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        }

        fetchProductById();
    }, [id])

    async function handleAddToCart() {
        if (amount < 1) {
            alert("Jumlah minimal 1 kg");
            return;
        }

        setIsAddingToCart(true);
        try {
            const data = await addItemToCart(id, parseInt(amount));
            console.log(data);
            alert("Berhasil ditambahkan ke keranjang!");
            navigate("/cart");
        } catch (e) {
            console.error(e);
            alert("Gagal menambahkan ke keranjang");
        } finally {
            setIsAddingToCart(false);
        }
    }

    function handleBuyNow() {
        if (amount < 1) {
            alert("Jumlah minimal 1 kg");
            return;
        }

        // Siapkan data produk untuk checkout
        const checkoutItem = {
            product_id: dataJson.id,
            title: dataJson.title,
            price: dataJson.price,
            quantity: amount,
            image_url: dataJson.image_urls?.[0],
            satuan: 'kg'
        };

        // Navigate ke checkout dengan data produk
        navigate('/checkout', { 
            state: { 
                checkoutItems: [checkoutItem],
                fromProduct: true
            } 
        });
    }

    return (
        <>
            { isLoading 
            ? <ProductDetailSkeleton />
            :  <div className="min-h-screen bg-gray-50 pb-24 md:pb-6">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="container mx-auto px-4 py-4 md:py-6">
                        <div className="flex items-center space-x-2 md:space-x-4">
                            <button 
                                onClick={() => navigate("/product")} 
                                className="p-1 md:p-0 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="md:w-10 md:h-10" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"/>
                                </svg>
                            </button>
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold" style={{ color: '#585656' }}>
                                Detail Produk 
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="container mx-auto px-4 py-4 md:py-6 grid lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Konten utama */}
                    <div className="lg:col-span-2 space-y-4 md:space-y-5">
                        {/* Tampilan gambar produk */}
                        <div className="w-full bg-white shadow-md p-3 md:p-4 rounded-md">
                            <div className="grid md:grid-cols-2 gap-3 md:gap-5">
                                {/* Main Image */}
                                <div
                                    className="h-[200px] md:h-[250px] lg:h-[300px] w-full bg-cover bg-center rounded-md"
                                    style={{ backgroundImage: `url(${dataJson?.image_urls?.[0] || ''})` }}
                                ></div>

                                {/* Product Info */}
                                <div className="flex flex-col justify-between">
                                    {/* Judul dan rating */}
                                    <div className="flex flex-col-reverse sm:flex-row justify-between items-start w-full gap-2">
                                        <h1 className="font-bold text-lg md:text-xl lg:text-2xl break-words flex-1">
                                            {dataJson?.title}
                                        </h1>
                                        <div className="flex space-x-1 items-center flex-shrink-0">
                                            <span className="text-yellow-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                                </svg>
                                            </span>
                                            <p className="text-sm md:text-base">{dataJson?.average_rating || 0}</p>
                                        </div>
                                    </div>

                                    {/* harga dan stok */}
                                    <div className="flex justify-between pt-3 md:pt-5 text-sm md:text-base">
                                        <h2 className="font-bold">{PriceIDFormat(dataJson?.price)}/kg</h2>
                                        <h2 className="text-gray-600">Stok: <span className="font-semibold text-gray-900">{dataJson?.available_stock} kg</span></h2>
                                    </div>

                                    {/* Petani dan alamat*/}
                                    <div className="pt-3 md:pt-5 space-y-1 text-sm md:text-base">
                                        <h2 className="flex space-x-2 items-center">
                                            <CircleUser size={18} className="flex-shrink-0" />
                                            <span className="truncate">
                                                {dataJson?.farmer_name || ""}
                                            </span>
                                        </h2>
                                        <h2 className="flex space-x-2 items-start">
                                            <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                                            <span className="break-words">
                                                {dataJson?.location}
                                            </span>
                                        </h2>    
                                    </div>

                                    {/* Gambar thumbnails */}
                                    <div className="w-full grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-3 pt-3 md:pt-4">
                                        {dataJson?.image_urls?.map((img, index) => 
                                            index !== 0 && (
                                                <div key={index} className="w-full aspect-square">
                                                    <img 
                                                        src={img} 
                                                        alt={`image-${index}`} 
                                                        className="w-full h-full object-cover rounded-md hover:opacity-80 transition-opacity cursor-pointer"
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tampilan deskripsi */}
                        <div className="w-full bg-white shadow-md p-3 md:p-4 rounded-md">
                            <h1 className="w-full text-lg md:text-xl font-bold py-2 border-b-2">Deskripsi</h1>
                            <p className="pt-3 text-sm md:text-base text-gray-700 whitespace-pre-wrap">
                                {dataJson?.description}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar Desktop */}
                    <div className="hidden lg:block bg-white rounded-md shadow-md h-fit sticky top-4 p-5">
                        <h1 className="font-bold text-xl">Informasi Pembelian</h1>
                        <form onSubmit={(e) => e.preventDefault()} className="pt-3">
                            <label htmlFor="amount" className="text-sm font-medium text-gray-700">
                                Jumlah
                            </label>
                            <div className="relative mt-1">
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">/ kg</span>
                                <input 
                                    type="number" 
                                    min={1} 
                                    id="amount" 
                                    value={amount}
                                    onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))} 
                                    className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500" 
                                    placeholder="Masukkan angka" 
                                />
                            </div>
                        </form>
                        <div className="w-full pt-4 space-y-2">
                            <button 
                                onClick={handleAddToCart}
                                disabled={isAddingToCart}
                                className={`w-full flex items-center justify-center space-x-2 p-2.5 rounded-md shadow-sm border border-gray-300 ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'} transition-all`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-cart3" viewBox="0 0 16 16">
                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                                </svg>
                                <span className="font-medium">{isAddingToCart ? 'Menambahkan...' : 'Tambah ke Keranjang'}</span>
                            </button>
                            <button 
                                disabled={amount < 1} 
                                onClick={handleBuyNow} 
                                className={`w-full ${amount < 1 ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} transition-all rounded-md text-white font-semibold py-2.5`}
                            >
                                Beli Sekarang
                            </button>
                        </div>
                    </div>

                    {/* Bottom Bar Mobile & Tablet */}
                    <div className="fixed lg:hidden bg-white bottom-0 left-0 right-0 border-t shadow-lg z-40">
                        <div className="container mx-auto px-4 py-3">
                            <div className="flex items-center space-x-3">
                                {/* Input Amount */}
                                <div className="flex-1">
                                    <div className="relative">
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs md:text-sm">/ kg</span>
                                        <input 
                                            type="number" 
                                            min={1}
                                            value={amount}
                                            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))} 
                                            className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-12 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-500" 
                                            placeholder="Jumlah" 
                                        />
                                    </div>
                                </div>

                                {/* Cart Button */}
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart}
                                    className={`p-2.5 md:p-3 rounded-md shadow-sm bg-yellow-500 text-white ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'} transition-all flex-shrink-0`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-cart3" viewBox="0 0 16 16">
                                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                                    </svg>
                                </button>

                                {/* Buy Button */}
                                <button 
                                    disabled={amount < 1} 
                                    onClick={handleBuyNow} 
                                    className={`${amount < 1 ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} transition-all rounded-md text-white font-semibold px-4 md:px-6 py-2.5 text-sm md:text-base flex-shrink-0`}
                                >
                                    Beli
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    )
}