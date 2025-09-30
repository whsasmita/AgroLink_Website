export default function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex justify-between w-full items-center space-x-4">
              <div className="hidden md:flex space-x-2">
                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6 grid grid-cols-3 gap-6">
        {/* Konten utama */}
        <div className="col-span-2">
          {/* Tampilan gambar produk */}
          <div className="w-full grid grid-cols-2 gap-5 bg-white shadow-md p-3 rounded-md">
            <div className="md:h-[250px] h-[120px] w-full bg-gray-200 rounded-md animate-pulse" />
            <div className="space-y-4">
              {/* Judul dan rating */}
              <div className="flex flex-col-reverse lg:flex-row justify-between items-start w-full">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2 lg:mb-0" />
                <div className="flex space-x-2 items-center">
                  <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              {/* harga dan stok */}
              <div className="flex justify-between pt-5">
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Petani dan alamat */}
              <div className="space-y-2 pt-5">
                <div className="flex items-center space-x-2">
                  <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Tampilan deskripsi */}
          <div className="w-full mt-5 bg-white shadow-md p-3 rounded-md">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sticky top-[100px] h-fit">
          <div className="bg-white shadow-md rounded-md p-4 space-y-4 animate-pulse">
            <div className="h-6 w-24 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
