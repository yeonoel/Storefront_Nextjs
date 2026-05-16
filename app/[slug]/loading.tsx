export default function LoadingHome() {
  return (
    <div className="animate-pulse">
      {/* Hero banner skeleton */}
      <div className="w-full bg-gray-200" style={{ minHeight: "320px" }} />

      {/* Produits vedettes skeleton */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="flex items-center justify-between mb-6">
          <div className="h-5 w-28 bg-gray-200 rounded-full" />
          <div className="h-4 w-16 bg-gray-100 rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div>
      <div className="aspect-square bg-gray-200 rounded-xl mb-3" />
      <div className="space-y-2">
        <div className="h-3.5 bg-gray-200 rounded-full w-4/5" />
        <div className="h-3 bg-gray-100 rounded-full w-2/5" />
        <div className="h-4 bg-gray-200 rounded-full w-3/5" />
      </div>
    </div>
  );
}
