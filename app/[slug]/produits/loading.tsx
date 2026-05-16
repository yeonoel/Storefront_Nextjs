export default function LoadingCatalogue() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 animate-pulse">
      {/* Header */}
      <div className="mb-6">
        <div className="h-6 w-32 bg-gray-200 rounded-full mb-2" />
        <div className="h-3.5 w-20 bg-gray-100 rounded-full" />
      </div>

      {/* Barre de recherche */}
      <div className="h-10 bg-gray-100 rounded-xl mb-4" />

      {/* Chips catégories */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-20 bg-gray-100 rounded-full flex-shrink-0"
          />
        ))}
      </div>

      {/* Grille */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
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
