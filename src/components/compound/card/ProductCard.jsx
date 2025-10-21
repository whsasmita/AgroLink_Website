import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addItemToCart } from "../../../services/cartService";

export default function ProductCard({id, name, rating, image}){
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    function truncateText(text, maxChars) {
        if (text.length <= maxChars) return text;
        return text.slice(0, maxChars) + "...";
    }

    async function handleAddToCart() {
        setIsLoading(true);
        try {
            const data = await addItemToCart(id, quantity);
            console.log(data);
            setShowModal(false);
            setQuantity(1);
            navigate("/cart");
        } catch (e) {
            console.error(e);
            alert("Gagal menambahkan ke keranjang");
        } finally {
            setIsLoading(false);
        }
    }

    function openModal() {
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setQuantity(1);
    }

    return (
        <>
            <div className="bg-white h-[260px] sm:h-[280px] md:h-[300px] w-full shadow-md border border-gray-100 rounded-md overflow-hidden relative hover:shadow-xl transition-shadow duration-300">
                {/* Image */}
                <div
                    className="h-[120px] sm:h-[140px] md:h-[160px] w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                ></div>

                {/* Content */}
                <div className="flex flex-col justify-between h-[140px] sm:h-[140px] md:h-[140px]">
                    {/* Product Info */}
                    <div className="flex flex-col-reverse sm:flex-row justify-between items-start w-full py-2 px-3 md:px-4">
                        <h1 className="font-semibold text-sm sm:text-base md:text-lg break-words w-full sm:w-4/5 line-clamp-2">
                            {name}
                        </h1>

                        <div className="flex space-x-1 items-center mb-1 sm:mb-0 flex-shrink-0">
                            <span className="text-yellow-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                            </span>
                            <p className="text-xs sm:text-sm">{rating}</p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="px-3 md:px-4 pb-3">
                        <div className="flex space-x-2 w-full">
                            {/* Cart Button */}
                            <button 
                                onClick={openModal} 
                                className="p-2 sm:p-2.5 rounded-md border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all flex-shrink-0"
                                aria-label="Tambah ke keranjang"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                                </svg>
                            </button>
                            
                            {/* Buy Button */}
                            <button 
                                onClick={() => navigate(`/product/${id}`)} 
                                className="flex-1 bg-green-600 hover:bg-green-700 rounded-md text-white font-semibold text-xs sm:text-sm py-2 transition-colors"
                            >
                                Beli
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div 
                        className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Tambah ke Keranjang</h2>
                            <button 
                                onClick={closeModal} 
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                aria-label="Tutup modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                </svg>
                            </button>
                        </div>

                        {/* Product Info */}
                        <div className="flex space-x-3 mb-4 sm:mb-6">
                            <div 
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-md bg-cover bg-center flex-shrink-0"
                                style={{ backgroundImage: `url(${image})` }}
                            ></div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-1 line-clamp-2">{name}</h3>
                                <div className="flex space-x-1 items-center">
                                    <span className="text-yellow-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" className="sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                        </svg>
                                    </span>
                                    <p className="text-xs sm:text-sm text-gray-600">{rating}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quantity Input */}
                        <div className="mb-4 sm:mb-6">
                            <label htmlFor="quantity" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                Jumlah (kg)
                            </label>
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors active:bg-gray-100"
                                    aria-label="Kurangi jumlah"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                                    </svg>
                                </button>
                                <input
                                    type="number"
                                    id="quantity"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="flex-1 text-center border border-gray-300 rounded-md py-2 px-2 sm:px-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors active:bg-gray-100"
                                    aria-label="Tambah jumlah"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={closeModal}
                                className="w-full sm:flex-1 px-4 py-2.5 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base order-2 sm:order-1"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleAddToCart}
                                disabled={isLoading}
                                className={`w-full sm:flex-1 px-4 py-2.5 sm:py-2 rounded-md text-white font-medium transition-colors text-sm sm:text-base order-1 sm:order-2 ${
                                    isLoading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                                }`}
                            >
                                {isLoading ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}