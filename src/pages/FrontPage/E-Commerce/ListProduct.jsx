import { useEffect, useState } from "react";
import ProductCard from "../../../components/compound/card/ProductCard";
import ProductSkeleton from "../../../components/compound/skeleton/ProductSkeleton";
import { getProducts } from "../../../services/productServices";


export default function ListProduct(){
    const [isLoading, setLoading] = useState(true);
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                console.log(data);
                setProductList(data.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        }

        fetchProducts();
    }, [])

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Title Section */}
                            <div className="flex-1">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: '#585656' }}>
                                    Temukan Produk Pertanian Berkualitas
                                </h1>
                                <p className="text-sm sm:text-base text-gray-600 mt-1">
                                    Pilih produk berkualitas dari petani terbaik.
                                </p>
                            </div>
                            
                            {/* Search Bar */}
                            <div className="w-full lg:w-96 lg:flex-shrink-0">
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
                                        className="block w-full pl-10 pr-3 py-2 sm:py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
                        {isLoading 
                            ? Array(10).fill(0).map((_, i) => <ProductSkeleton key={i} />)
                            : productList.map(list => (
                                <ProductCard 
                                    key={list.id} 
                                    id={list.id} 
                                    name={list.title} 
                                    image={list.image_urls?.[0] || ''} 
                                    rating={list.average_rating || "0.0"} 
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}