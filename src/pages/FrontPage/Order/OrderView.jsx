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
    return (
        <>
            <div className="min-h-screen bg-gray-50 pt-10">
                {/* Header */}
                <div className="flex justify-center">
                    <div className="w-[600px] min-h-[400px]">
                        <div className="bg-white w-full h-full rounded-md shadow-md p-5">
                            <div className="w-full border-b flex justify-between">
                                <h1 className="text-lg font-semibold pb-5">Pesanan Saya</h1>
                            </div>
                            <OrderList />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}