export default function LoadingProduct() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 animate-pulse">
      {/* Fil d'Ariane */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-3 w-14 bg-gray-100 rounded-full" />
        <div className="h-3 w-2 bg-gray-100 rounded-full" />
        <div className="h-3 w-20 bg-gray-100 rounded-full" />
        <div className="h-3 w-2 bg-gray-100 rounded-full" />
        <div className="h-3 w-28 bg-gray-200 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Colonne gauche — Image */}
        <div className="space-y-3">
          <div className="aspect-square bg-gray-200 rounded-2xl" />
          {/* Miniatures */}
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Colonne droite — Infos */}
        <div className="flex flex-col gap-5">
          {/* Nom + Prix */}
          <div className="space-y-3">
            <div className="h-7 bg-gray-200 rounded-full w-3/4" />
            <div className="h-7 bg-gray-200 rounded-full w-1/3" />
          </div>

          {/* Description courte */}
          <div className="space-y-2">
            <div className="h-3.5 bg-gray-100 rounded-full w-full" />
            <div className="h-3.5 bg-gray-100 rounded-full w-4/5" />
          </div>

          {/* Sélecteur couleur */}
          <div>
            <div className="h-3 w-16 bg-gray-100 rounded-full mb-3" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 w-20 bg-gray-100 rounded-full" />
              ))}
            </div>
          </div>

          {/* Sélecteur taille */}
          <div>
            <div className="h-3 w-12 bg-gray-100 rounded-full mb-3" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-12 h-12 bg-gray-100 rounded-xl" />
              ))}
            </div>
          </div>

          {/* Bouton CTA */}
          <div className="pt-2">
            <div className="h-12 bg-gray-200 rounded-xl w-full" />
            <div className="h-3 w-48 bg-gray-100 rounded-full mx-auto mt-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
