import { useState } from "react";
import OrderList from "../../../components/fragments/list/OrderList";

const API = import.meta.env.VITE_SERVER_DOMAIN;

function PriceIDFormat(price){
    const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);

    return formatted;
}

export default function OrderView(){
    const [status, setStatus] = useState("dikemas");
    return (
        <>
            <div className="min-h-screen bg-gray-50 pt-10">
                {/* Header */}
                <div className="flex justify-center">
                    <div className="w-[600px] min-h-[400px]">
                        <div className="bg-white w-full h-full rounded-md shadow-md p-5">
                            <div className="w-full border-b justify-between">
                                <h1 className="text-lg font-semibold pb-5">Pesanan Saya</h1>
                                <div className="grid grid-cols-3">
                                    <button onClick={() => setStatus("dikemas")} className={`w-full ${status == "dikemas" && "border-b-2 border-green-600 font-semibold text-green-600"}`}>
                                        Dikemas
                                    </button>
                                    <button onClick={() => setStatus("dikirim")} className={`w-full ${status == "dikirim" && "border-b-2 border-green-600 font-semibold text-green-600"}`}>
                                        Dikirim
                                    </button>
                                    <button onClick={() => setStatus("selesai")} className={`w-full ${status == "selesai" && "border-b-2 border-green-600 font-semibold text-green-600"}`}>
                                        Selesai
                                    </button>
                                </div>
                            </div>
                            <OrderList status={status} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}