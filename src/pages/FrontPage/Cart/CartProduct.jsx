import { CircleUser, MapPin, Tag } from "lucide-react";
import CartProductList from "../../../components/fragments/list/CartProductList";
import { useEffect, useState } from "react";


const API = import.meta.env.VITE_SERVER_DOMAIN;
const dataCart = [
    {
        id: 1,
        name: "Rambutan Bali",
        farmer: "Darma Wiguna",
        price: 10000,
        amount: 2,
        image: `https://asset.kompas.com/crops/Mus88DR5T2JTAoaGmwe9J28ZJY8=/15x10:1000x667/750x500/data/photo/2020/12/30/5fec5a6ea600a.jpg`
    },
    {
        id: 2,
        name: "Rambutan Bali",
        farmer: "Darma Wiguna",
        price: 10000,
        amount: 2,
        image: `${API}/uploads/product/1a222014-4c47-4a96-9e18-bf97494350db.jpg`
    },
    {
        id: 2,
        name: "Rambutan Bali",
        farmer: "Darma Wiguna",
        price: 10000,
        amount: 2,
        image: `${API}/uploads/product/1a222014-4c47-4a96-9e18-bf97494350db.jpg`
    },
]

function PriceIDFormat(price){
    const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);

    return formatted;
}

export default function CartProduct(){
    // const [dataCart, setDataCart] = useState([]);

    const [dataCart, setDataCart] = useState([
    {
        id: 1,
        name: "Rambutan Bali",
        farmer: "Darma Wiguna",
        price: 10000,
        amount: 2,
        image: "https://asset.kompas.com/crops/Mus88DR5T2JTAoaGmwe9J28ZJY8=/15x10:1000x667/750x500/data/photo/2020/12/30/5fec5a6ea600a.jpg"
    },
]);

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
            <div className="min-h-screen pt-10 bg-gray-50">
                {/* Header */}
                <div className="flex justify-center">
                    <div className="w-[600px] min-h-[400px]">
                        <div className="w-full h-full p-5 bg-white rounded-md shadow-md">
                            <div className="flex justify-between w-full border-b">
                                <h1 className="pb-5 text-lg font-semibold">Keranjang Produk</h1>
                                <div className="flex items-center space-x-2">
                                    <input id="selectAll" type="checkbox" />
                                    <label htmlFor="selectAll">Semua</label>
                                </div>
                            </div>
                            {/* { dataCart.map((data, index) => (
                                <CartProductList key={index} id={data.id} amount={data.amount} farmer={data.farmer} image={`${API}/uploads/product/${data.image[0]}`} name={data.name} price={data.price} onChecked={(id, amount) => cons} />
                            )) } */}
                            { dataCart.map((data, index) => (
                                <CartProductList key={index} id={data.id} amount={data.amount} farmer={data.farmer} image={data.image} name={data.name} price={data.price} onChecked={(id, amount) => cons} />
                            )) }
                        </div>
                    </div>
                </div>

            </div>

            {/* Main content */}
            <div className="fixed bottom-0 left-0 w-full">
                <div className="flex justify-center">
                    <div className="max-w-[800px] w-full border-2 bg-white border-green-600 p-5 rounded-md">
                        <table className="">
                            <tbody>
                                {/* List Produk */}
                                <tr className="">
                                    <th className="w-1/2 pr-16 font-normal text-start">Subtotal produk</th>
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
                        <div className="flex items-center justify-between mt-5">
                            <div>
                                <span>Total</span>
                                <h1 className="text-2xl font-bold">{PriceIDFormat(98980)}</h1>
                            </div>
                            <div>
                                <button className="px-5 py-2 text-xl text-white bg-green-600 rounded-md">
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