import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  MdArrowBack, 
  MdPerson, 
  MdLocationOn, 
  MdAttachMoney,
  MdWork,
  MdDescription,
  MdInventory,
  MdCategory
} from "react-icons/md";
import { 
  getProductsById
} from "../../../../services/productServices";

// Skeleton Loading Component
const LoadingSkeleton = () => (
  <div className="p-4">
    <div className="flex items-center mb-6">
      <div className="w-6 h-6 mr-4 bg-gray-200 rounded-full animate-pulse"></div>
      <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
    </div>
    
    <div className="max-w-4xl mx-auto">
      <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
        <div className="w-64 h-10 mb-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-32 h-6 mb-6 bg-gray-200 rounded animate-pulse"></div>

        {/* Image Gallery Skeleton */}
        <div className="mb-6">
            <div className="w-full h-64 mb-4 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex gap-2">
                <div className="w-20 h-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
        </div>
        
        {/* Details Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        
        <div className="pt-6 mt-6 border-t border-gray-200">
          <div className="w-20 h-4 mb-2 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-full h-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

const BackpageDetailProduct = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State untuk galeri gambar
  const [selectedImage, setSelectedImage] = useState(0); 

  const navigate = useNavigate();
  const { productId: id } = useParams();

  // Fetch data produk
  const fetchProduct = async () => {
    if (!id || id.trim() === '') {
      setError("ID produk tidak valid.");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await getProductsById(id.trim());
      
      if (response && response.status === "success" && response.data) {
        setProduct(response.data);
        if (response.data.image_urls && response.data.image_urls.length > 0) {
            setSelectedImage(0); 
        }
      } else {
        setError("Format respons API tidak valid.");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      if (err.message.includes('404')) {
        setError("Produk tidak ditemukan. Pastikan ID produk benar.");
      } else {
        setError(err.message || "Gagal memuat data produk.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleBack = () => {
    navigate("/dashboard/products");
  };

  // Helper format mata uang
  const formatRupiah = (number) => {
    if (number === null || number === undefined) return 'Tidak disebutkan';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="flex items-center mb-6">
          <button onClick={handleBack} className="p-2 mr-4 text-gray-600 transition-colors rounded-full hover:text-gray-800 hover:bg-gray-100">
            <MdArrowBack size={24} />
          </button>
          <h2 className="text-2xl font-bold text-main">Detail Produk</h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="p-4 border-l-4 rounded-r-lg bg-red-50 border-danger">
            <div className="flex">
              <MdWork className="mt-1 mr-3 text-danger" size={20} />
              <div>
                <h3 className="mb-1 text-lg font-medium text-danger">Terjadi Kesalahan</h3>
                <p className="text-danger">{error}</p>
                <button onClick={fetchProduct} className="px-4 py-2 mt-3 text-white transition-colors rounded-lg bg-danger hover:bg-red-600">
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-4">
        <div className="flex items-center mb-6">
          <button onClick={handleBack} className="p-2 mr-4 text-gray-600 transition-colors rounded-full hover:text-gray-800 hover:bg-gray-100">
            <MdArrowBack size={24} />
          </button>
          <h2 className="text-2xl font-bold text-main">Detail Produk</h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="py-8 text-center">
            <MdWork size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">Produk Tidak Ditemukan</h3>
            <p className="mb-4 text-gray-500">Produk yang Anda cari tidak dapat ditemukan.</p>
            <button onClick={handleBack} className="px-6 py-3 font-medium text-white transition-colors rounded-lg bg-main hover:bg-green-600">
              Kembali ke Daftar Produk
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={handleBack} className="p-2 mr-4 text-gray-600 transition-colors rounded-full hover:text-gray-800 hover:bg-gray-100">
            <MdArrowBack size={24} />
          </button>
          <h2 className="text-2xl font-bold text-main">Detail Produk</h2>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Main Content */}
        <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
          {/* Product Title and Category */}
          <div className="flex flex-col mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">{product.title || 'Nama Produk'}</h1>
              <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                {product.category || 'Tanpa Kategori'}
              </span>
            </div>
          </div>

          {/* Image Gallery */}
          {product.image_urls && product.image_urls.length > 0 && (
            <div className="mb-6">
                <img 
                    src={product.image_urls[selectedImage]} 
                    alt={product.title}
                    className="object-cover w-full h-64 mb-4 border border-gray-200 rounded-lg md:h-80"
                />
                <div className="flex gap-2 overflow-x-auto">
                    {product.image_urls.map((url, index) => (
                        <img 
                            key={index}
                            src={url}
                            alt={`Thumbnail ${index + 1}`}
                            onClick={() => setSelectedImage(index)}
                            className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${selectedImage === index ? 'border-main' : 'border-transparent'}`}
                        />
                    ))}
                </div>
            </div>
          )}

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MdPerson className="flex-shrink-0 mt-1 text-gray-600" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Petani</p>
                  <p className="font-medium text-gray-900">{product.farmer_name || 'Tidak tersedia'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MdCategory className="flex-shrink-0 mt-1 text-gray-600" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Kategori</p>
                  <p className="text-gray-900">{product.category || 'Tidak disebutkan'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MdLocationOn className="flex-shrink-0 mt-1 text-gray-600" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Lokasi</p>
                  <p className="text-gray-900">{product.location || 'Tidak disebutkan'}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MdAttachMoney className="flex-shrink-0 mt-1 text-gray-600" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Harga</p>
                  <p className="text-lg font-medium text-gray-900 text-main">{formatRupiah(product.price)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MdInventory className="flex-shrink-0 mt-1 text-gray-600" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Stok Tersedia</p>
                  <p className="font-medium text-gray-900">{product.available_stock || 0} pcs</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MdWork className="flex-shrink-0 mt-1 text-gray-600" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-600">ID Produk</p>
                  <p className="font-mono text-sm text-gray-900">{product.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <MdDescription className="flex-shrink-0 mt-1 text-gray-600" size={20} />
              <div className="flex-1">
                <p className="mb-2 text-sm font-medium text-gray-600">Deskripsi Produk</p>
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="leading-relaxed text-gray-900 whitespace-pre-wrap">
                    {product.description || 'Tidak ada deskripsi tersedia.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackpageDetailProduct;