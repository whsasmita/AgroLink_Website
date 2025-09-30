export default function ProductSkeleton() {
  return (
    <div className="bg-white h-[280px] w-full shadow-md border-gray-100 rounded-md overflow-clip relative animate-pulse">
      {/* Image skeleton */}
      <div className="h-[150px] w-full bg-gray-200"></div>

      {/* Text skeleton */}
      <div className="grid grid-cols-5 gap-x-2 w-full py-2 px-4 items-start">
        <div className="col-span-4">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="flex space-x-1 items-center">
          <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-6 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Buttons skeleton */}
      <div className="absolute bottom-0 left-0 w-full">
        <div className="flex space-x-2 p-3 w-full">
          <div className="p-2 w-10 h-10 bg-gray-200 rounded-md"></div>
          <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
