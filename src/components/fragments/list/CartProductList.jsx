import { CircleUser } from "lucide-react";
import { useState } from "react"

function PriceIDFormat(price){
    const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);

    return formatted;
}

export default function CartProductList({id, name, farmer, amount, price, image, onChecked}){
    const [amountProduct, setAmountProduct] = useState(amount);
    const [priceProduct, setPriceProduct] = useState(price);
    console.log(image)

    return (
        <>
            <div className="flex items-center justify-between space-x-3 py-2 border-b">
                <div className="flex items-center space-x-3 my-2">
                    <input type="checkbox" name="id" id="" className="border" onClick={() => onChecked({ id, amount })} />
                    <div
                        className="w-20 h-20 bg-cover bg-center rounded-md"
                        style={{ backgroundImage: `url(${image}` }}
                    ></div>
                    <div>
                        <h2 className="text-lg">{name}</h2>
                        <div className="text-sm flex items-center space-x-2 text-neutral-600">
                            <CircleUser size={16}/>
                            <span>{farmer}</span>
                        </div>
                        <div className="text-lg flex items-center space-x-2 font-bold mt-4">
                            {/* <Tag size={16}/> */}
                            <span>{PriceIDFormat(priceProduct * amountProduct)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <div className="flex space-x-2 items-center">
                        <button onClick={() => {
                            if (amountProduct > 1){
                                setAmountProduct(amountProduct - 1)
                            }
                        }} className="h-6 w-6 flex justify-center items-center rounded-md bg-green-500 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus-icon lucide-minus"><path d="M5 12h14"/></svg>
                        </button>
                        <span>
                            {amountProduct}
                        </span>
                        <button onClick={() => setAmountProduct(amountProduct + 1)} className="h-6 w-6 flex justify-center items-center rounded-md bg-green-500 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}