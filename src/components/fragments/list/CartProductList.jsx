import { useState } from "react";
import { updateCartItem } from "../../../services/cartService";

function PriceIDFormat(price){
    const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);

    return formatted;
}

export default function CartProductList({id, name, farmer, amount, price, image, isChecked, onChecked, onDelete}){
    const [amountProduct, setAmountProduct] = useState(amount);
    const [priceProduct] = useState(price);
    const [isUpdating, setIsUpdating] = useState(false);

    async function handleDecrement() {
        if (amountProduct === 1) {
            if (confirm(`Hapus ${name} dari keranjang?`)) {
                onDelete(id);
            }
            return;
        }

        setIsUpdating(true);
        const newAmount = amountProduct - 1;
        
        try {
            await updateCartItem(id, newAmount);
            setAmountProduct(newAmount);
        } catch (err) {
            console.error(err);
            alert("Gagal mengupdate jumlah");
        } finally {
            setIsUpdating(false);
        }
    }

    async function handleIncrement() {
        setIsUpdating(true);
        const newAmount = amountProduct + 1;
        
        try {
            await updateCartItem(id, newAmount);
            setAmountProduct(newAmount);
        } catch (err) {
            console.error(err);
            alert("Gagal mengupdate jumlah");
        } finally {
            setIsUpdating(false);
        }
    }

    function handleCheckboxChange(e) {
        onChecked(id, e.target.checked);
    }

    return (
        <>
            <div className="flex items-center justify-between space-x-3 py-2 border-b">
                <div className="flex items-center space-x-3 my-2">
                    <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        className="border w-4 h-4" 
                    />
                    <div
                        className="w-20 h-20 bg-cover bg-center rounded-md"
                        style={{ backgroundImage: `url(${image})` }}
                    ></div>
                    <div>
                        <h2 className="text-lg">{name}</h2>
                        <div className="text-lg flex items-center space-x-2 font-bold mt-4">
                            <span>{PriceIDFormat(priceProduct * amountProduct)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <div className="flex space-x-2 items-center">
                        <button 
                            onClick={handleDecrement}
                            disabled={isUpdating}
                            className={`h-6 w-6 flex justify-center items-center rounded-md ${
                                amountProduct === 1 
                                    ? 'bg-red-500 hover:bg-red-600' 
                                    : 'bg-green-500 hover:bg-green-600'
                            } text-white ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''} transition-colors`}
                        >
                            {amountProduct === 1 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14"/>
                                </svg>
                            )}
                        </button>
                        <span className="min-w-[20px] text-center">
                            {amountProduct}
                        </span>
                        <button 
                            onClick={handleIncrement}
                            disabled={isUpdating}
                            className={`h-6 w-6 flex justify-center items-center rounded-md bg-green-500 hover:bg-green-600 text-white ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''} transition-colors`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14"/><path d="M12 5v14"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}