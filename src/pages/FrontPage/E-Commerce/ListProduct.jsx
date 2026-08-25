import { useEffect, useState } from "react";
import ProductCard from "../../../components/compound/card/ProductCard";
import ProductSkeleton from "../../../components/compound/skeleton/ProductSkeleton";
import { getProducts } from "../../../services/productServices";

export default function ListProduct() {
  const [isLoading, setLoading] = useState(true);
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        console.log(data);
        const products = data.data || [];
        
        // Sort products by rating (highest first)
        const sortedProducts = [...products].sort((a, b) => {
          const ratingA = parseFloat(a.rating) || 0;
          const ratingB = parseFloat(b.rating) || 0;
          return ratingB - ratingA;
        });
        
        setProductList(sortedProducts);
        setFilteredProducts(sortedProducts);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(productList);
    } else {
      const filtered = productList.filter((item) =>
        (item.title || item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, productList]);

  return (
    <>
      <div className="min-h-screen bg-slate-50/50 pb-16">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 shadow-xs">
          <div className="max-w-7xl px-4 py-8 mx-auto">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Title Section */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-main text-xs font-semibold rounded-full mb-2 border border-green-200/50">
                  <span>🌾 Pasar Komoditas & Hasil Tani</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Pasar Hasil Tani Berkualitas
                </h1>
                <p className="mt-1 text-sm sm:text-base text-gray-500">
                  Dapatkan komoditas segar dan produk berkualitas langsung dari petani lokal.
                </p>
              </div>

              {/* Search Bar */}
              <div className="w-full lg:w-96 lg:flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                    <svg
                      className="w-4 h-4"
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
                    placeholder="Cari produk di pasar..."
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-2xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl px-4 py-8 mx-auto">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-4 lg:gap-5">
            {isLoading ? (
              Array(12)
                .fill(0)
                .map((_, i) => <ProductSkeleton key={i} />)
            ) : filteredProducts?.length > 0 ? (
              filteredProducts.map((list) => (
                <ProductCard
                  key={list.id}
                  id={list.id}
                  name={list.title || list.name}
                  image={list.image_urls?.[0] || list.image || ""}
                  rating={list.rating || "5.0"}
                />
              ))
            ) : (
              <div className="p-10 text-center border border-dashed border-gray-200 rounded-3xl col-span-full bg-white max-w-md mx-auto space-y-3">
                <div className="flex items-center justify-center mb-2">
                  <svg
                    className="w-12 h-12 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-gray-800">
                  Tidak Ada Produk Ditemukan
                </h3>
                <p className="text-sm text-gray-500">
                  Produk yang Anda cari tidak ditemukan. Coba kata kunci lain atau segarkan kembali.
                </p>
                <button
                  className="px-6 py-2.5 text-xs font-semibold text-white transition-all bg-main rounded-xl hover:bg-green-600 shadow-sm"
                  onClick={() => setSearchTerm("")}
                >
                  Reset Pencarian
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}