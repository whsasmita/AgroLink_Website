import { CircleUser } from "lucide-react";

function PriceIDFormat(price){
    const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);

    return formatted;
}

function renderButtonByStatus(status){
    if (status == "dikemas") {
        return (
            <div className="absolute right-1 bottom-1 space-x-2">
                <button className="border w-full  rounded-md p-2">
                    Detail
                </button>
            </div>
        )
    } else if (status == "dikirim") {
        return (
            <div className="absolute right-1 bottom-1">
                <button className="border bottom-0 right-1 rounded-md p-2">
                    Lacak
                </button>
            </div>
        )
    } else {
        return (
            <div className="absolute right-1 bottom-1">
                <div className="flex space-x-2 w-full">
                    <button className="border rounded-md p-2">
                        Detail
                    </button>
                    <button className="border w-full rounded-md p-2">
                        Unduh
                    </button>
                </div>
            </div>
        )
    }
}

export default function OrderList({status}){
    return (
        <>
            <div className="flex justify-between space-x-3 py-2 border-b">
                <div className="flex items-start space-x-3 my-2">
                    <div
                        className="w-20 h-20 bg-cover bg-center rounded-md"
                        style={{ backgroundImage: `url(${"http://localhost:8000/uploads/product/77ad16eb-50e6-4d29-898b-0f508769c07f.jpeg"})` }}
                    ></div>
                    <div>
                        <h2 className="text-lg">Salak Bali</h2>
                        <div className="text-sm flex items-center space-x-2 text-neutral-600">
                            <span>Id Pesanan: 122334557</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-start relative">
                    <div className="text-lg flex items-start space-x-2 font-bold">
                        {/* <Tag size={16}/> */}
                        <span >Rp25.000</span>
                    </div>
                    {renderButtonByStatus(status)}
                </div>
            </div>
        </>
    )
}