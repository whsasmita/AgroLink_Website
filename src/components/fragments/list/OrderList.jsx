import { CircleUser, FileText, Search, Download } from "lucide-react";

function PriceIDFormat(price){
    const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);

    return formatted;
}

function renderButtonByStatus(status){

    // Main Button Style
    const baseButton = "px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200 flex items-center gap-1.5";

    // Secondary Button Style
    const secondaryButton = `${baseButton} bg-gray-100 text-gray-800 hover:bg-gray-200`;

    // Primary Button Style
    const primaryButton = `${baseButton} bg-green-600 text-white hover:bg-green-700`;

    if (status == "dikemas") {
        return (
            <button className={secondaryButton}><FileText size={14} /> Detail</button>
        )
    } else if (status == "dikirim") {
        return (
            <button className={primaryButton}><Search size={14} /> Lacak</button>
        )
    } else {
        return (
            <div className="flex space-x-2">
                <button className={secondaryButton}><FileText size={14} /> Detail</button>
                <button className={primaryButton}><Download size={14} /> Unduh</button>
            </div>
        )
    }
}

export default function OrderList({status}){
    return (
        <>
            <div className="w-full p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                
                <div className="flex items-start gap-3">
                    <div
                        className="flex-shrink-0 w-16 h-16 bg-center bg-cover rounded-md sm:w-20 sm:h-20"
                        style={{ backgroundImage: `url(${"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAw1tZOdmLDQYE-NqY5U_UVbOGpC-OQEcm3g&s"})` }}
                    ></div>
                    <div className="flex-grow">
                        <h2 className="text-sm font-semibold leading-tight text-gray-800 sm:text-base">Salak Bali</h2>
                        <div className="mt-1 text-xs text-gray-500">
                            <span>Id Pesanan: 122334557</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                    <div>
                        <span className="text-xs text-gray-500">Total Harga</span>
                        <p className="text-sm font-bold text-gray-800 sm:text-base">Rp25.000</p>
                    </div>
                    
                    <div className="flex-shrink-0">
                        {renderButtonByStatus(status)}
                    </div>  
                </div>
            </div>
        </>
    )
}