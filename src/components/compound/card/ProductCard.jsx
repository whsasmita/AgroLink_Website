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
            <div className="bg-white h-[280px] w-full shadow-md border-gray-100 rounded-md overflow-clip relative">
                <div
                    className="md:h-[150px] h-[120px] w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                ></div>
                <div className="flex flex-col-reverse lg:flex-row justify-between items-start w-full py-2 px-4">
                    <h1 className="font-semibold text-lg break-words lg:w-4/5">
                        {truncateText(name, 35)}
                    </h1>

                    <div className="flex space-x-1 items-center mb-2 lg:mb-0">
                        <span className="text-yellow-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                        </span>
                        <p>{rating}</p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full">
                    <div className="flex space-x-2 p-3 w-full">
                        {/* Button Cart */}
                        <button onClick={openModal} className="p-2 rounded-md shadow-md border-gray-300 hover:bg-gray-50 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart3" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                            </svg>
                        </button>
                        <button onClick={() => navigate(`/product/${id}`)} className="w-full bg-green-600 transition-all hover:bg-green-700 rounded-md text-white font-semibold">
                            Beli
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Tambah ke Keranjang</h2>
                            <button 
                                onClick={closeModal} 
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                </svg>
                            </button>
                        </div>

                        {/* Product Info */}
                        <div className="flex space-x-3 mb-6">
                            <div 
                                className="w-20 h-20 rounded-md bg-cover bg-center flex-shrink-0"
                                style={{ backgroundImage: `url(${image})` }}
                            ></div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800 mb-1">{name}</h3>
                                <div className="flex space-x-1 items-center">
                                    <span className="text-yellow-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                        </svg>
                                    </span>
                                    <p className="text-sm text-gray-600">{rating}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quantity Input */}
                        <div className="mb-6">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                                Jumlah (kg)
                            </label>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                                    </svg>
                                </button>
                                <input
                                    type="number"
                                    id="quantity"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="flex-1 text-center border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-3">
                            <button
                                onClick={closeModal}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleAddToCart}
                                disabled={isLoading}
                                className={`flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors ${
                                    isLoading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700'
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