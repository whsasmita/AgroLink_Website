import { CircleUser, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import ProductDetailSkeleton from "../../../components/compound/skeleton/ProductDetailSkeleton";
import { useNavigate, useParams } from "react-router-dom";

function PriceIDFormat(price){
    const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);

    return formatted;
}

export default function DetailProduct(){
    const [isLoading, setLoading] = useState(true);
    const [dataJson, setDataJson] = useState("");
    const API = import.meta.env.VITE_SERVER_DOMAIN;
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductById = async () => {
            fetch(`${API}/product/show/${id}`)
            .then((res) => {
                if (!res.ok){
                    throw new Error("Gagal mengambil data")
                }
                return res.json()
            })
            .then((data) => {
                console.log(data);
                setDataJson(data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
        }

        fetchProductById();
    }, [])

    return (
        <>
            { isLoading 
            ? <ProductDetailSkeleton />
            :  <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex justify-between w-full items-center space-x-4">
                                <div className="hidden md:flex space-x-2">
                                    <span onClick={() => navigate("/product")} className="cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-arrow-left-short" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"/>
                                        </svg>
                                    </span>
                                    <h1 className="text-3xl font-bold" style={{ color: '#585656' }}>
                                        Detail Produk 
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="container mx-auto px-4 py-6 grid md:grid-cols-3 gap-6">
                    {/* Konten utama */}
                    <div className="col-span-2 h-max">
                        {/* Tampilan gambar produk */}
                        <div className="w-full grid md:grid-cols-2 gap-5 bg-white shadow-md p-3 rounded-md">
                            <div
                                className="md:h-[250px] h-[200px] w-full bg-cover bg-center rounded-md"
                                style={{ backgroundImage: `url(${API}/uploads/product/${encodeURI(dataJson.image)})` }}
                            ></div>
                            <div className="">
                                {/* Judul dan rating */}
                                <div className="flex flex-col-reverse lg:flex-row justify-between items-start w-full">
                                    <h1 className="font-bold text-2xl break-words lg:w-4/5">
                                        {dataJson.title}
                                    </h1>
                                    <div className="flex space-x-1 items-center mb-2 lg:mb-0">
                                        <span className="text-yellow-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                            </svg>
                                        </span>
                                        <p>{dataJson.average_rating ? dataJson.average_rating : 0}</p>
                                    </div>
                                </div>

                                {/* harga dan stok */}
                                <div className="flex justify-between pt-5">
                                    <h2 className="font-bold">{PriceIDFormat(dataJson.price)}/{dataJson.satuan}</h2>
                                    <h2>Stok: {dataJson.stock} {dataJson.satuan}</h2>
                                </div>

                                {/* Petani dan alamat*/}
                                <div className=" pt-5">
                                    <h2 className="flex space-x-2 items-center">
                                        <CircleUser size={18} />
                                        <span>
                                            {dataJson.user.name}
                                        </span>
                                    </h2>
                                    <h2 className="flex space-x-2 items-center">
                                        <MapPin size={18} />
                                        <span>
                                            {dataJson.location}
                                        </span>
                                    </h2>    
                                </div>
                            </div>
                        </div>
                        {/* Tampilan deskripsi */}
                        <div className="w-full mt-5 bg-white shadow-md p-3 rounded-md">
                            <h1 className="w-full text-xl font-bold py-2 border-b-2">Deskripsi</h1>
                            <p>
                                {dataJson.description}
                            </p>
                        </div>
                    </div>


                    {/* Sidebar */}
                    <div className="bg-white hidden md:block rounded-md shadow-md h-[200px] sticky top-[100px] p-5">
                        <h1 className="font-bold text-xl">Informasi Pembelian</h1>
                        <form action="" className="pt-3">
                            <label htmlFor="amount">
                                Jumlah
                            </label>
                            <div className="relative">
                                <span className="absolute right-2 translate-y-2 bg-white">/ {dataJson.satuan}</span>
                                <input type="number" id="amount" className="w-full border rounded-md py-2 pl-2 pr-10" placeholder="Masukkan angka" />
                            </div>
                        </form>
                        <div className="w-full pt-4">
                            <div className="flex space-x-2 w-full">
                                <button className="p-2 rounded-md shadow-md border-gray-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
                                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                                    </svg>
                                </button>
                                <button className="w-full bg-green-600 transition-all hover:bg-green-700 rounded-md text-white font-semibold">
                                    Beli
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Form untuk tampilan mobile */}
                    <div className="fixed md:hidden bg-green-600 bottom-0 left-0 w-full flex space-x-4 p-5">
                        <div className="flex-1">
                            <div className="relative">
                                <span className="absolute right-2 translate-y-2 bg-white">/ {dataJson.satuan}</span>
                                <input type="number" id="amount" className="w-full border rounded-md py-2 pl-2 pr-10" placeholder="Masukkan angka" />
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 rounded-md shadow-md border-gray-300 text-white bg-yellow-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                                </svg>
                            </button>
                            <button className="bg-white transition-all hover:bg-green-700 rounded-md text-green-600 font-semibold px-4">
                                Beli
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    )
}