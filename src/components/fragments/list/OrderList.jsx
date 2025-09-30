import { CircleUser } from "lucide-react";

function PriceIDFormat(price){
    const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);

    return formatted;
}

export default function OrderList(){

    return (
        <>
            <div className="flex justify-between space-x-3 py-2 border-b">
                <div className="flex items-center space-x-3 my-2">
                    <div
                        className="w-20 h-20 bg-cover bg-center rounded-md"
                        style={{ backgroundImage: `url(${"http://localhost:8000/uploads/product/77ad16eb-50e6-4d29-898b-0f508769c07f.jpeg"})` }}
                    ></div>
                    <div>
                        <h2 className="text-lg">Salak Bali</h2>
                        <div className="text-sm flex items-center space-x-2 text-neutral-600">
                            <span>Id Pesanan: 122334557</span>
                        </div>
                        <div className="text-lg flex items-start space-x-2 font-bold mt-4">
                            {/* <Tag size={16}/> */}
                            <span>Rp25.000</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-start relative">
                    <span className="text-green-600 font-bold px-5 text-sm rounded-lg">Dalam Perjalanan</span>
                    <button className="border absolute bottom-0 right-1 rounded-md p-2">
                        Lacak
                    </button>
                </div>
            </div>
        </>
    )
}