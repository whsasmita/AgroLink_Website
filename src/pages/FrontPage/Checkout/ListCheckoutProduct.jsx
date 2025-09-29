import { useState } from "react";
import logoImage from "../../../assets/images/Logo.png";
import agrolinkText from "../../../assets/images/agrolink.png"

export default function ListCheckoutProduct(){
    const [amount, setAmount] = useState(0);
    return (
        <>
            <nav className="fixed flex justify-between top-0 left-0 right-0 z-50 bg-white h-[80px] shadow-md px-3">
                <div className="flex items-center h-full space-x-3">
                    <img src={logoImage} alt="logo" className="w-8 h-8" />
                    <img src={agrolinkText} alt="logo-text" className="w-28 h-4" />
                </div>
                <div className="flex items-center h-full">
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md text-md">
                        Batal
                    </button>
                </div>
            </nav>
            <div className="w-full grid grid-cols-3 min-h-screen">
                <div className="col-span-2 pt-[100px]">
                    <h1 className="font-semibold text-2xl text-center">Pembelian</h1>
                    <div className="mx-20 mt-4">
                        <div className="">
                            <h3>Alamat</h3>
                            <div className="w-full px-5 py-2 border rounded-md ">
                                Rumah
                            </div>
                        </div>
                        <div className="mt-5">
                            <h3>Detail Order</h3>
                            <div className="rounded-md flex justify-between border px-3 py-2">
                                <div>Apel Manalagi</div>
                                <div>Rp.23.000/kg</div>
                                <div className="flex space-x-2 items-center">
                                    <button onClick={() => setAmount(amount - 1)} className="h-6 w-6 flex justify-center items-center rounded-md bg-green-500 text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus-icon lucide-minus"><path d="M5 12h14"/></svg>
                                    </button>
                                    <span>
                                        {amount}
                                    </span>
                                    <button onClick={() => setAmount(amount + 1)} className="h-6 w-6 flex justify-center items-center rounded-md bg-green-500 text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="my-2 h-1 w-full bg-slate-300"></div>
                            <div className="flex justify-between">
                                <span>Total Harga Produk</span>
                                <span>Rp.28.000</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-300 pt-[100px] flex justify-center">
                    <div>
                        <h1 className="font-semibold text-2xl text-center">Rangkuman Order</h1>
                        <table className="mt-5">
                            <tbody>
                                {/* List Produk */}
                                <tr>
                                    <th className="pr-16 font-normal text-start">Subtotal produk</th>
                                    <th>Rp.28.000</th>
                                </tr>
                                <tr>
                                    <th className="pr-16 font-normal text-start">Diskon 10%</th>
                                    <th>-Rp.20.000</th>
                                </tr>
                                <tr>
                                    <th className="pr-16 font-normal text-start">PPn 11%</th>
                                    <th>Rp.2.000</th>
                                </tr>

                                {/*  */}
                                <tr className="border-t-2 border-black">
                                    <th className="pr-16 font-normal text-start">Total</th>
                                    <th>Rp10.000</th>
                                </tr>
                            </tbody>
                        </table>
                        <div className="mt-10">
                            <button className="bg-green-600 rounded-md text-white w-full py-2">
                                Beli Sekarang
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}