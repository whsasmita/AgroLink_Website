import { useEffect, useState } from "react";
import logoImage from "../../../assets/images/Logo.png";
import agrolinkText from "../../../assets/images/agrolink.png"
import { useLocation, useNavigate } from "react-router-dom";

function PriceIDFormat(price){
    const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);

    return formatted;
}

export default function ListCheckoutProduct(){
    const location = useLocation();
    const navigate = useNavigate();
    const { dataJson, amountProduct } = location.state || {};
    const [amount, setAmount] = useState(amountProduct || 1);
    const userData = localStorage.getItem('access_token');

    useEffect(() => {
        if (!userData) {
            navigate("/auth/login", { replace: true });
        }
    }, [userData, navigate]);

    useEffect(() => {
        console.log("Data JSON yang dilempar: ", dataJson);
    }, [])

    return (
        <>
            <nav className="fixed flex justify-between top-0 left-0 right-0 z-50 bg-white h-[80px] shadow-md px-3">
                <div className="flex items-center h-full space-x-3">
                    <img src={logoImage} alt="logo" className="w-8 h-8" />
                    <img src={agrolinkText} alt="logo-text" className="h-4 w-28" />
                </div>
                <div className="flex items-center h-full">
                    <button onClick={() => navigate("/product", { replace: true })} className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 text-md">
                        Batal
                    </button>
                </div>
            </nav>
            <div className="grid w-full min-h-screen grid-cols-3">
                <div className="col-span-2 pt-[100px]">
                    <h1 className="text-2xl font-semibold text-center">Pembelian</h1>
                    <div className="mx-20 mt-4">
                        <div className="">
                            <h3>Alamat</h3>
                            <div className="w-full px-5 py-2 border rounded-md ">
                                Rumah
                            </div>
                        </div>
                        <div className="mt-5">
                            <h3>Detail Order</h3>
                            <div className="flex justify-between px-3 py-2 border rounded-md">
                                <div>{dataJson.title}</div>
                                <div>{PriceIDFormat(dataJson.price)}/{dataJson.satuan}</div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => {
                                        if (amount > 1){
                                            setAmount(amount - 1)
                                        }
                                    }} className="flex items-center justify-center w-6 h-6 text-white bg-green-500 rounded-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus-icon lucide-minus"><path d="M5 12h14"/></svg>
                                    </button>
                                    <span>
                                        {amount}
                                    </span>
                                    <button onClick={() => setAmount(amount + 1)} className="flex items-center justify-center w-6 h-6 text-white bg-green-500 rounded-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="w-full h-1 my-2 bg-slate-300"></div>
                            <div className="flex justify-between">
                                <span>Total Harga Produk</span>
                                <span>{PriceIDFormat(dataJson.price * amount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-300 pt-[100px] flex justify-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-center">Rangkuman Order</h1>
                        <table className="mt-5">
                            <tbody>
                                {/* List Produk */}
                                <tr>
                                    <th className="pr-16 font-normal text-start">Subtotal produk</th>
                                    <th>{PriceIDFormat(dataJson.price * amount)}</th>
                                </tr>
                                <tr>
                                    <th className="pr-16 font-normal text-start">Diskon 10%</th>
                                    <th>-{PriceIDFormat((dataJson.price * amount) * 10 / 100)}</th>
                                </tr>
                                <tr>
                                    <th className="pr-16 font-normal text-start">PPn 11%</th>
                                    <th>{PriceIDFormat((dataJson.price * amount) * 11 / 100)}</th>
                                </tr>

                                {/*  */}
                                <tr className="border-t-2 border-black">
                                    <th className="pr-16 font-normal text-start">Total</th>
                                    <th>{PriceIDFormat((dataJson.price * amount) - ((dataJson.price * amount) * 10 / 100) + ((dataJson.price * amount) * 11 / 100))}</th>
                                </tr>
                            </tbody>
                        </table>
                        <div className="mt-10">
                            <button className="w-full py-2 text-white bg-green-600 rounded-md">
                                Beli Sekarang
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}