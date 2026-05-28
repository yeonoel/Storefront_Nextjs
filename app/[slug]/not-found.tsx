import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl font-medium text-gray-200 mb-4">404</p>
      <h1 className="text-lg font-medium text-gray-900 mb-2">
        Page introuvable
      </h1>
      <p className="text-sm text-gray-400 mb-8 max-w-xs">
        Cette boutique n'existe pas ou n'est plus disponible.
      </p>
      <Link
        href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL || "/"}`}
        className="text-sm px-5 py-2.5 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-colors"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
