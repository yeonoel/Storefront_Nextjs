import Link from "next/link";
import { Product, getPrimaryImage } from "@/app/types/product";
import { formatPrice } from "@/app/lib/utils";

interface ProductCardProps {
  product: Product;
  storeSlug: string;
  primaryColor?: string;
}

export default function ProductCard({
  product,
  storeSlug,
  primaryColor = "#1A1A1A",
}: ProductCardProps) {
  const image = getPrimaryImage(product);
  const href = `/${storeSlug}/produits/${product.slug}`;

  const availableColors = [
    ...new Set(
      product.variants
        .filter((v) => v.isActive && !v.isDeleted && v.color)
        .map((v) => v.color as string),
    ),
  ];

  return (
    <Link href={href} className="group block">
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
        {image ? (
          <img
            src={image.imageUrl}
            alt={image.altText || product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <NoImageIcon className="w-10 h-10 text-gray-300" />
          </div>
        )}

        {/* Badge promo */}
        {product.isOnSale && product.discountPercentage && (
          <span
            className="absolute top-2 left-2 text-white text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: primaryColor }}
          >
            -{product.discountPercentage}%
          </span>
        )}

        {/* Badge rupture */}
        {product.isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs text-gray-500 font-medium bg-white px-3 py-1 rounded-full border border-gray-200">
              Épuisé
            </span>
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="space-y-1">
        <p className="text-sm text-gray-900 font-medium leading-snug line-clamp-2">
          {product.name}
        </p>

        {/* Variantes couleurs */}
        {availableColors.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {availableColors.slice(0, 4).map((color) => (
              <ColorDot key={color} color={color} />
            ))}
            {availableColors.length > 4 && (
              <span className="text-[10px] text-gray-400">
                +{availableColors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Prix */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: primaryColor }}>
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Interprète la couleur texte comme CSS color
function ColorDot({ color }: { color: string }) {
  const cssColors: Record<string, string> = {
    noir: "#1a1a1a",
    blanc: "#ffffff",
    rouge: "#dc2626",
    bleu: "#2563eb",
    vert: "#16a34a",
    jaune: "#ca8a04",
    rose: "#db2777",
    gris: "#6b7280",
    marron: "#92400e",
    orange: "#ea580c",
    violet: "#7c3aed",
    beige: "#d4b896",
    black: "#1a1a1a",
    white: "#ffffff",
    red: "#dc2626",
    blue: "#2563eb",
    green: "#16a34a",
  };

  const bg = cssColors[color.toLowerCase()] ?? "#e5e7eb";
  const needsBorder = bg === "#ffffff" || bg === "#e5e7eb";

  return (
    <span
      title={color}
      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
      style={{
        backgroundColor: bg,
        border: needsBorder ? "1px solid #d1d5db" : "none",
      }}
    />
  );
}

function NoImageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18h16.5a.75.75 0 00.75-.75V6a.75.75 0 00-.75-.75H3.75A.75.75 0 003 6.25v11.25c0 .414.336.75.75.75z"
      />
    </svg>
  );
}
