"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Product,
  ProductVariant,
  ProductImage,
  getPrimaryImage,
  getAvailableStock,
  isVariantAvailable,
  getVariantPrice,
  formatPrice,
} from "../../../types/product";
import { StoreData, buildWhatsAppUrl } from "../../../types/store";

interface ProductPageProps {
  store: StoreData;
  product: Product;
}

export default function ProductPage({ store, product }: ProductPageProps) {
  const primaryColor = store.primaryColor || "#1A1A1A";
  const base = `/${store.slug}`;

  // Image active
  const primaryImage = getPrimaryImage(product);
  const sortedImages = [...product.images].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  const [activeImage, setActiveImage] = useState<ProductImage | null>(
    primaryImage,
  );

  // Variants actifs uniquement
  const activeVariants = product.variants.filter(
    (v) => v.isActive && !v.isDeleted,
  );

  // Options uniques disponibles
  const colors = useMemo(
    () =>
      [
        ...new Set(
          activeVariants.map((v: ProductVariant) => v.color).filter(Boolean),
        ),
      ] as string[],
    [activeVariants],
  );
  const sizes = useMemo(
    () =>
      [
        ...new Set(
          activeVariants.map((v: ProductVariant) => v.size).filter(Boolean),
        ),
      ] as string[],
    [activeVariants],
  );
  const materials = useMemo(
    () =>
      [
        ...new Set(
          activeVariants.map((v: ProductVariant) => v.material).filter(Boolean),
        ),
      ] as string[],
    [activeVariants],
  );

  const [selectedColor, setSelectedColor] = useState<string | null>(
    colors[0] ?? null,
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    sizes[0] ?? null,
  );
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(
    materials[0] ?? null,
  );

  // Variant correspondant à la sélection actuelle
  const matchedVariant = useMemo<ProductVariant | null>(() => {
    if (!activeVariants.length) return null;
    return (
      activeVariants.find((v: ProductVariant) => {
        const colorOk = !colors.length || v.color === selectedColor;
        const sizeOk = !sizes.length || v.size === selectedSize;
        const materialOk = !materials.length || v.material === selectedMaterial;
        return colorOk && sizeOk && materialOk;
      }) ?? null
    );
  }, [
    activeVariants,
    selectedColor,
    selectedSize,
    selectedMaterial,
    colors,
    sizes,
    materials,
  ]);

  const currentPrice = matchedVariant
    ? getVariantPrice(matchedVariant, product.price)
    : product.price;

  const stock = matchedVariant
    ? getAvailableStock(matchedVariant)
    : (product.stockQuantity ?? 0);
  const isAvailable = matchedVariant
    ? isVariantAvailable(matchedVariant)
    : stock > 0;
  const isLowStock =
    isAvailable && stock > 0 && stock <= (product.lowStockThreshold ?? 5);

  // Construction du message WhatsApp
  function buildWhatsAppMessage(): string {
    const lines = [
      `Bonjour, je voudrais commander :`,
      ``,
      `🛍️ *${product.name}*`,
    ];
    if (selectedColor) lines.push(`Couleur : ${selectedColor}`);
    if (selectedSize) lines.push(`Taille : ${selectedSize}`);
    if (selectedMaterial) lines.push(`Matière : ${selectedMaterial}`);
    lines.push(`Prix : ${formatPrice(currentPrice)}`);
    lines.push(``);
    lines.push(`Merci !`);
    return lines.join("\n");
  }

  const hasVariants =
    colors.length > 0 || sizes.length > 0 || materials.length > 0;
  const canOrder = !hasVariants || (isAvailable && !!matchedVariant);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link href={base} className="hover:text-gray-600 transition-colors">
          Accueil
        </Link>
        <span>/</span>
        <Link
          href={`${base}/produits`}
          className="hover:text-gray-600 transition-colors"
        >
          Catalogue
        </Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-[150px]">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* ── Colonne gauche : Images ── */}
        <div className="space-y-3">
          {/* Image principale */}
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
            {activeImage ? (
              <img
                src={activeImage.imageUrl}
                alt={activeImage.altText || product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <NoImageIcon className="w-16 h-16 text-gray-200" />
              </div>
            )}

            {product.isOnSale && product.discountPercentage && (
              <span
                className="absolute top-3 left-3 text-white text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ backgroundColor: primaryColor }}
              >
                -{product.discountPercentage}%
              </span>
            )}
          </div>

          {/* Miniatures */}
          {sortedImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {sortedImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img)}
                  className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors"
                  style={{
                    borderColor:
                      activeImage?.id === img.id ? primaryColor : "transparent",
                  }}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.altText || product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Colonne droite : Infos + Variants ── */}
        <div className="flex flex-col gap-5">
          {/* Nom + Prix */}
          <div>
            <h1 className="text-xl md:text-2xl font-medium text-gray-900 leading-snug">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span
                className="text-2xl font-medium"
                style={{ color: primaryColor }}
              >
                {formatPrice(currentPrice)}
              </span>
              {product.compareAtPrice && (
                <span className="text-base text-gray-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Description courte */}
          {product.shortDescription && (
            <p className="text-sm text-gray-500 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* ── Sélecteur couleur ── */}
          {colors.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2.5">
                Couleur{selectedColor ? ` — ${selectedColor}` : ""}
              </p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const variantForColor = activeVariants.find(
                    (v: ProductVariant) => v.color === color,
                  );
                  const available = variantForColor
                    ? isVariantAvailable(variantForColor)
                    : false;
                  return (
                    <button
                      key={color}
                      onClick={() => available && setSelectedColor(color)}
                      disabled={!available}
                      className="text-sm px-4 py-2 rounded-full border transition-all"
                      style={
                        selectedColor === color
                          ? {
                              backgroundColor: primaryColor,
                              borderColor: primaryColor,
                              color: "white",
                            }
                          : available
                            ? {
                                backgroundColor: "white",
                                borderColor: "#e5e7eb",
                                color: "#374151",
                              }
                            : {
                                backgroundColor: "#f9fafb",
                                borderColor: "#e5e7eb",
                                color: "#d1d5db",
                              }
                      }
                    >
                      {color}
                      {!available && (
                        <span className="ml-1 text-[10px]">(épuisé)</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Sélecteur taille ── */}
          {sizes.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2.5">
                Taille
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const variantForSize = activeVariants.find(
                    (v: ProductVariant) =>
                      v.size === size &&
                      (!selectedColor || v.color === selectedColor),
                  );
                  const available = variantForSize
                    ? isVariantAvailable(variantForSize)
                    : false;
                  return (
                    <button
                      key={size}
                      onClick={() => available && setSelectedSize(size)}
                      disabled={!available}
                      className="w-12 h-12 rounded-xl border text-sm font-medium transition-all"
                      style={
                        selectedSize === size
                          ? {
                              backgroundColor: primaryColor,
                              borderColor: primaryColor,
                              color: "white",
                            }
                          : available
                            ? {
                                backgroundColor: "white",
                                borderColor: "#e5e7eb",
                                color: "#374151",
                              }
                            : {
                                backgroundColor: "#f9fafb",
                                borderColor: "#f3f4f6",
                                color: "#d1d5db",
                                textDecoration: "line-through",
                              }
                      }
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Sélecteur matière ── */}
          {materials.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2.5">
                Matière
              </p>
              <div className="flex flex-wrap gap-2">
                {materials.map((material) => (
                  <button
                    key={material}
                    onClick={() => setSelectedMaterial(material)}
                    className="text-sm px-4 py-2 rounded-full border transition-all"
                    style={
                      selectedMaterial === material
                        ? {
                            backgroundColor: primaryColor,
                            borderColor: primaryColor,
                            color: "white",
                          }
                        : {
                            backgroundColor: "white",
                            borderColor: "#e5e7eb",
                            color: "#374151",
                          }
                    }
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock info */}
          {isLowStock && (
            <p className="text-xs text-amber-600 font-medium">
              ⚠️ Plus que {stock} en stock
            </p>
          )}
          {!isAvailable && hasVariants && matchedVariant && (
            <p className="text-xs text-red-500 font-medium">
              Cette combinaison est épuisée
            </p>
          )}

          {/* ── CTA WhatsApp ── */}
          <div className="pt-2">
            {store.whatsappNumber && canOrder ? (
              <a
                href={buildWhatsAppUrl(
                  store.whatsappNumber,
                  buildWhatsAppMessage(),
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#25D366" }}
              >
                <WhatsAppIcon className="w-5 h-5" />
                Commander via WhatsApp
              </a>
            ) : (
              <button
                disabled
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl text-sm font-medium text-gray-400 bg-gray-100 cursor-not-allowed"
              >
                {!store.whatsappNumber
                  ? "Contact vendeur non disponible"
                  : hasVariants && !matchedVariant
                    ? "Sélectionnez vos options"
                    : "Produit épuisé"}
              </button>
            )}

            {/* Mention livraison */}
            <p className="text-center text-xs text-gray-400 mt-3">
              Paiement à la livraison · Confirmation immédiate sur WhatsApp
            </p>
          </div>

          {/* Description complète */}
          {product.description && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Description
              </p>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Icons ──

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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
