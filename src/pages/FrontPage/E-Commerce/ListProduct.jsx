import { useEffect, useState } from "react";
import ProductCard from "../../../components/compound/card/ProductCard";
import ProductSkeleton from "../../../components/compound/skeleton/ProductSkeleton";


export default function ListProduct(){
    const [isLoading, setLoading] = useState(true);
    const [productList, setProductList] = useState([]);
    const API = import.meta.env.VITE_SERVER_DOMAIN;

    useEffect(() => {
        const fetchProducts = async () => {
            fetch(`${API}/product/getall`)
            .then((res) => {
                if (!res.ok){
                    throw new Error("Gagal mengambil produk");
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setProductList(data.data) 
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            })
        }

        fetchProducts();
    }, [])
    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex justify-between w-full items-center space-x-4">
                                <div className="hidden md:block">
                                    <h1 className="text-3xl font-bold" style={{ color: '#585656' }}>
                                        Temukan Produk Pertanian Berkualitas
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        Pilih produk berkualitas dari petani terbaik.
                                    </p>
                                </div>
                                {/* Search Bar */}
                                <div className="flex-shrink-0 lg:w-96">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg 
                                        className="h-5 w-5 text-gray-400" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                                        />
                                    </svg>
                                    </div>
                                    <input
                                    type="text"
                                    placeholder="Cari produk di sini..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                                    style={{ 
                                        focusRingColor: '#39B54A',
                                    }}
                                    />
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                    {isLoading 
                    ? Array(10).fill(0).map((_, i) => <ProductSkeleton key={i} />)
                    : productList.map(list => (
                        <ProductCard key={list.id} id={list.id} name={list.title} image={`${API}/uploads/product/${encodeURI(list.image[0])}`} rating={list.average_rating ? list.average_rating : "0.0" } />
                    ))}
                </div>
            </div>
        </>
    )
}