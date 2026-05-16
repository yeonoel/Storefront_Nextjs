import Link from "next/link";
import {
  StoreData,
  getStoreInitials,
  getStoreTagline,
  buildWhatsAppUrl,
} from "@/app/types/store";
import { Product } from "@/app/types/product";
import ProductCard from "@/app/components/shared/ProductCard";

interface HomePageProps {
  store: StoreData;
  featuredProducts: Product[];
}

export default function HomePage({ store, featuredProducts }: HomePageProps) {
  const primaryColor = store.primaryColor || "#1A1A1A";
  const base = `/${store.slug}`;

  return (
    <div>
      {/* ── HERO BANNER ── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: "320px" }}
      >
        {store.bannerUrl ? (
          <>
            <img
              src={store.bannerUrl}
              alt={`Bannière ${store.name}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay sombre pour lisibilité du texte */}
            <div className="absolute inset-0 bg-black/45" />
          </>
        ) : (
          /* Fallback si pas de bannière */
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}ee 0%, ${primaryColor}99 100%)`,
            }}
          />
        )}

        {/* Contenu banner */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 min-h-[320px]">
          {/* Logo si pas de bannière */}
          {!store.bannerUrl && (
            <div className="mb-4">
              {store.logoUrl ? (
                <img
                  src={store.logoUrl}
                  alt={store.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/30 mx-auto"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-medium mx-auto">
                  {getStoreInitials(store.name)}
                </div>
              )}
            </div>
          )}

          <h1 className="text-white text-2xl md:text-4xl font-medium leading-snug max-w-lg">
            {getStoreTagline(store)}
          </h1>

          <p className="text-white/70 text-sm mt-2 mb-6">
            Paiement à la livraison · Confirmation via WhatsApp
          </p>

          <Link
            href={`${base}/produits`}
            className="inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full transition-opacity hover:opacity-90"
            style={{ backgroundColor: "white", color: primaryColor }}
          >
            Voir la collection
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── PRODUITS VEDETTES ── */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base md:text-lg font-medium text-gray-900">
            {featuredProducts.length > 0 ? "Nouveautés" : "Nos produits"}
          </h2>
          <Link
            href={`${base}/produits`}
            className="text-sm transition-colors hover:opacity-80"
            style={{ color: primaryColor }}
          >
            Tout voir →
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                storeSlug={store.slug}
                primaryColor={primaryColor}
              />
            ))}
          </div>
        ) : (
          <EmptyProducts store={store} primaryColor={primaryColor} />
        )}
      </section>

      {/* ── BANDEAU WHATSAPP ── */}
      {store.whatsappNumber && (
        <section className="bg-gray-50 border-y border-gray-100 py-8 md:py-10">
          <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <p className="text-sm md:text-base font-medium text-gray-900">
                Une question sur un produit ?
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                On vous répond directement sur WhatsApp.
              </p>
            </div>
            <a
              href={buildWhatsAppUrl(
                store.whatsappNumber,
                `Bonjour, j'ai une question sur votre boutique ${store.name}`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-white px-5 py-2.5 rounded-full flex-shrink-0 transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#25D366" }}
            >
              <WhatsAppIcon className="w-4 h-4" />
              Nous contacter
            </a>
          </div>
        </section>
      )}
    </div>
  );
}

function EmptyProducts({
  store,
  primaryColor,
}: {
  store: StoreData;
  primaryColor: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: `${primaryColor}15` }}
      >
        <BoxIcon className="w-6 h-6" style={{ color: primaryColor }} />
      </div>
      <p className="text-gray-500 text-sm max-w-xs">
        Aucun produit pour le moment. Revenez bientôt !
      </p>
    </div>
  );
}

// ── Icons ──

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
      />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function BoxIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
      />
    </svg>
  );
}
