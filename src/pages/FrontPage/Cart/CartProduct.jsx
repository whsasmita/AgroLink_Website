import CartProductList from "../../../components/fragments/list/CartProductList";
import { useEffect, useState } from "react";
import { getCartItems, removeItemFromCart } from "../../../services/cartService";
import { useNavigate } from "react-router-dom";

function PriceIDFormat(price){
    const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);

    return formatted;
}

export default function CartProduct(){
    const navigate = useNavigate();
    const [dataCart, setDataCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchCartData();
    }, [])

    async function fetchCartData() {
        try {
            const response = await getCartItems();
            console.log('Response cart:', response);
            if (Array.isArray(response?.data?.items)) {
                setDataCart(response.data.items);
            } else {
                setDataCart([]);
            }
            setIsLoading(false);
        } catch (err) {
            console.error(err);
            setDataCart([]);
            setIsLoading(false);
        }
    }

    function handleCheckItem(productId, isChecked) {
        if (isChecked) {
            setSelectedItems([...selectedItems, productId]);
        } else {
            setSelectedItems(selectedItems.filter(id => id !== productId));
        }
    }

    function handleSelectAll(isChecked) {
        if (isChecked) {
            setSelectedItems(dataCart.map(item => item.product_id));
        } else {
            setSelectedItems([]);
        }
    }

    async function handleDeleteSelected() {
        if (selectedItems.length === 0) {
            alert("Pilih item yang ingin dihapus");
            return;
        }

        if (!confirm(`Hapus ${selectedItems.length} item dari keranjang?`)) {
            return;
        }

        setIsDeleting(true);
        
        try {
            const deletePromises = selectedItems.map(productId => 
                removeItemFromCart(productId)
            );
            
            await Promise.all(deletePromises);
            
            alert("Item berhasil dihapus dari keranjang");
            setSelectedItems([]);
            
            await fetchCartData();
        } catch (err) {
            console.error(err);
            alert("Gagal menghapus beberapa item");
        } finally {
            setIsDeleting(false);
        }
    }

    async function handleItemDeleted(productId) {
        try {
            await removeItemFromCart(productId);
            alert("Item berhasil dihapus dari keranjang");
            
            await fetchCartData();
        } catch (err) {
            console.error(err);
            alert("Gagal menghapus item");
        }
    }

    function handleItemUpdated(productId, newQuantity) {
        setDataCart(prevCart => 
            prevCart.map(item => 
                item.product_id === productId 
                    ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity }
                    : item
            )
        );
    }

    function handleCheckout() {
        if (selectedItems.length === 0) {
            alert("Pilih item yang ingin dibeli");
            return;
        }

        // Filter data cart untuk mendapatkan hanya item yang dicentang
        const selectedCartItems = dataCart.filter(item => 
            selectedItems.includes(item.product_id)
        );

        // Navigate ke halaman checkout dengan membawa data item yang dipilih
        navigate("/checkout", {
            state: {
                checkoutItems: selectedCartItems
            }
        });
    }

    // Hitung subtotal hanya dari item yang dicentang
    const subtotal = dataCart
        .filter(item => selectedItems.includes(item.product_id))
        .reduce((total, item) => total + (item.price * item.quantity), 0);
    
    const ppn = subtotal * 0.11;
    const grandTotal = subtotal + ppn;

    return (
        <>
            <div className="min-h-screen pt-10 bg-gray-50">
                {/* Header */}
                <div className="flex justify-center">
                    <div className="w-[600px] min-h-[400px]">
                        <div className="w-full h-full p-5 bg-white rounded-md shadow-md">
                            <div className="flex justify-between w-full border-b pb-5">
                                <h1 className="text-lg font-semibold">Keranjang Produk</h1>
                                <div className="flex items-center space-x-4">
                                    {selectedItems.length > 0 && (
                                        <button
                                            onClick={handleDeleteSelected}
                                            disabled={isDeleting}
                                            className={`px-3 py-1 text-sm rounded-md ${
                                                isDeleting 
                                                    ? 'bg-gray-300 cursor-not-allowed' 
                                                    : 'bg-red-500 hover:bg-red-600 text-white'
                                            } transition-colors`}
                                        >
                                            {isDeleting ? 'Menghapus...' : `Hapus (${selectedItems.length})`}
                                        </button>
                                    )}
                                    <div className="flex items-center space-x-2">
                                        <input 
                                            id="selectAll" 
                                            type="checkbox" 
                                            checked={dataCart.length > 0 && selectedItems.length === dataCart.length}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                        />
                                        <label htmlFor="selectAll">Semua</label>
                                    </div>
                                </div>
                            </div>
                            
                            {isLoading ? (
                                <div className="py-10 text-center text-gray-500">
                                    Memuat keranjang...
                                </div>
                            ) : dataCart.length === 0 ? (
                                <div className="py-10 text-center text-gray-500">
                                    Keranjang kosong
                                </div>
                            ) : (
                                dataCart.map((item, index) => (
                                    <CartProductList 
                                        key={index} 
                                        id={item.product_id} 
                                        amount={item.quantity} 
                                        image={item.image_url} 
                                        name={item.title} 
                                        price={item.price} 
                                        isChecked={selectedItems.includes(item.product_id)}
                                        onChecked={(productId, isChecked) => handleCheckItem(productId, isChecked)}
                                        onDelete={handleItemDeleted}
                                        onUpdate={handleItemUpdated}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg">
                <div className="flex justify-center">
                    <div className="max-w-[800px] w-full border-2 bg-white border-green-600 p-5 rounded-md">
                        <table className="w-full">
                            <tbody>
                                <tr className="">
                                    <th className="w-1/2 pr-16 font-normal text-start">Subtotal produk</th>
                                    <th className="text-end">{PriceIDFormat(subtotal)}</th>
                                </tr>
                                <tr>
                                    <th className="pr-16 font-normal text-start">PPN 11%</th>
                                    <th className="text-end">{PriceIDFormat(ppn)}</th>
                                </tr>
                            </tbody>
                        </table>
                        <div className="flex items-center justify-between mt-5">
                            <div>
                                <span>Total</span>
                                <h1 className="text-2xl font-bold">{PriceIDFormat(grandTotal)}</h1>
                            </div>
                            <div>
                                <button 
                                    onClick={handleCheckout}
                                    disabled={selectedItems.length === 0}
                                    className={`px-5 py-2 text-xl text-white rounded-md ${
                                        selectedItems.length === 0 
                                            ? 'bg-gray-300 cursor-not-allowed' 
                                            : 'bg-green-600 hover:bg-green-700'
                                    } transition-colors`}
                                >
                                    Beli Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}