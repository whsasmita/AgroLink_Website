export default function ProductCard({name, rating, image}){
    function truncateText(text, maxChars) {
        if (text.length <= maxChars) return text;
        return text.slice(0, maxChars) + "...";
    }

    return (
        <div className="bg-white h-[280px] w-full shadow-md border-gray-100 rounded-md overflow-clip relative">
            <div
                className="h-[150px] w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
            ></div>
            <div className="grid grid-cols-5 gap-x-2 w-full py-2 px-4 items-start">
                <h1 className="col-span-4 font-semibold text-lg break-words">{truncateText(name, 35)}</h1>
                <div className="flex space-x-1 items-center">
                    <span className="text-yellow-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                    </span>
                    <p>{rating}</p>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full">
                <div className="flex space-x-2 p-3 w-full">
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
    )
}