import { CircleUser, MapPin, Tag } from "lucide-react";
import CartProductList from "../../../components/fragments/list/CartProductList";
import { useEffect, useState } from "react";


const API = import.meta.env.VITE_SERVER_DOMAIN;
// const dataCart = [
//     {
//         id: 1,
//         name: "Rambutan Bali",
//         farmer: "Darma Wiguna",
//         price: 10000,
//         amount: 2,
//         image: `${API}/uploads/product/1a222014-4c47-4a96-9e18-bf97494350db.jpg`
//     },
//     {
//         id: 2,
//         name: "Rambutan Bali",
//         farmer: "Darma Wiguna",
//         price: 10000,
//         amount: 2,
//         image: `${API}/uploads/product/1a222014-4c47-4a96-9e18-bf97494350db.jpg`
//     },
//     {
//         id: 2,
//         name: "Rambutan Bali",
//         farmer: "Darma Wiguna",
//         price: 10000,
//         amount: 2,
//         image: `${API}/uploads/product/1a222014-4c47-4a96-9e18-bf97494350db.jpg`
//     },
// ]

function PriceIDFormat(price){
    const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);

    return formatted;
}

export default function CartProduct(){
    const [dataCart, setDataCart] = useState([]);

    useEffect(() => {
        async function GetDataCart() {
            try {
                const token = localStorage.getItem("access_token");
                const res = await fetch(`${API}/cart/mycart`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })

                if (!res.ok){
                    throw new Error("Gagal mengambil data cart");
                }

                const data = await res.json();
                console.log(data);
                setDataCart(data.data)
            } catch (err) {
                console.log(err)
            }
        }

        GetDataCart();
    }, [])

    return (
        <>
            <div className="min-h-screen bg-gray-50 pt-10">
                {/* Header */}
                <div className="flex justify-center">
                    <div className="w-[600px] min-h-[400px]">
                        <div className="bg-white w-full h-full rounded-md shadow-md p-5">
                            <div className="w-full border-b flex justify-between">
                                <h1 className="text-lg font-semibold pb-5">Keranjang Produk</h1>
                                <div className="flex space-x-2 items-center">
                                    <input id="selectAll" type="checkbox" />
                                    <label htmlFor="selectAll">Semua</label>
                                </div>
                            </div>
                            { dataCart.map((data, index) => (
                                <CartProductList key={index} id={data.id} amount={data.amount} farmer={data.farmer} image={`${API}/uploads/product/${data.image[0]}`} name={data.name} price={data.price} onChecked={(id, amount) => cons} />
                            )) }
                        </div>
                    </div>
                </div>

            </div>

            {/* Main content */}
            <div className="w-full fixed bottom-0 left-0">
                <div className="flex justify-center">
                    <div className="max-w-[800px] w-full border-2 bg-white border-green-600 p-5 rounded-md">
                        <table className="">
                            <tbody>
                                {/* List Produk */}
                                <tr className="">
                                    <th className="pr-16 font-normal text-start w-1/2">Subtotal produk</th>
                                    <th>{PriceIDFormat(98000)}</th>
                                </tr>
                                <tr>
                                    <th className="pr-16 font-normal text-start">Diskon 10%</th>
                                    <th>-{PriceIDFormat(9800)}</th>
                                </tr>
                                <tr>
                                    <th className="pr-16 font-normal text-start">PPn 11%</th>
                                    <th>{PriceIDFormat(10780)}</th>
                                </tr>

                            </tbody>
                        </table>
                        <div className="flex justify-between mt-5 items-center">
                            <div>
                                <span>Total</span>
                                <h1 className="text-2xl font-bold">{PriceIDFormat(98980)}</h1>
                            </div>
                            <div>
                                <button className="bg-green-600 text-white px-5 py-2 text-xl rounded-md">
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