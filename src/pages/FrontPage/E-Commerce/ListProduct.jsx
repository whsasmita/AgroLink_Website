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
        setProductList(data.data || []); // Add fallback to empty array
        setFilteredProducts(data.data || []); // Add fallback to empty array
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
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, productList]);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b shadow-sm">
          <div className="container px-4 py-4 mx-auto sm:px-6 lg:px-8 sm:py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Title Section */}
              <div className="flex-1">
                <h1
                  className="text-xl font-bold sm:text-2xl lg:text-3xl"
                  style={{ color: "#585656" }}
                >
                  Temukan Produk Pertanian Berkualitas
                </h1>
                <p className="mt-1 text-sm text-gray-600 sm:text-base">
                  Pilih produk berkualitas dari petani terbaik.
                </p>
              </div>

              {/* Search Bar */}
              <div className="w-full lg:w-96 lg:flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container px-4 py-4 mx-auto sm:px-6 lg:px-8 sm:py-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-4 lg:gap-5">
            {isLoading ? (
              Array(10)
                .fill(0)
                .map((_, i) => <ProductSkeleton key={i} />)
            ) : filteredProducts?.length > 0 ? ( // Add optional chaining
              filteredProducts.map((list) => (
                <ProductCard
                  key={list.id}
                  id={list.id}
                  name={list.title}
                  image={list.image_urls?.[0] || ""}
                  rating={list.average_rating || "0.0"}
                />
              ))
            ) : (
              <div className="p-8 text-center border border-gray-200 rounded-lg col-span-full bg-gray-50">
                <div className="flex items-center justify-center mb-4">
                  <svg
                    className="w-12 h-12 text-gray-400"
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
                <h3 className="mb-2 text-lg font-semibold text-gray-700">
                  Tidak Ada Produk Tersedia
                </h3>
                <p className="mb-4 text-gray-500">
                  Kami tidak dapat menemukan produk yang anda cari saat ini.
                  Silakan coba lagi nanti atau periksa kembali segera.
                </p>
                <button
                  className="px-6 py-2 text-sm font-medium text-white transition-opacity duration-200 rounded-md hover:opacity-90"
                  style={{ backgroundColor: "#39B54A" }}
                  onClick={() => window.location.reload()}
                >
                  Coba Lagi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}