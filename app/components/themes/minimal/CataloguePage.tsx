"use client";

import { useState, useMemo } from "react";
import { StoreData } from "@/app/types/store";
import { Product } from "@/app/types/product";
import ProductCard from "../../shared/ProductCard";
import { SearchIcon, CloseIcon } from "@/app/components/Icons/icons";

interface CataloguePageProps {
  store: StoreData;
  products: Product[];
}

export default function CataloguePage({ store, products }: CataloguePageProps) {
  const primaryColor = store.primaryColor || "#1A1A1A";

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("tout");

  // Catégories uniques depuis les produits
  const categories = useMemo(() => {
    const cats = [
      ...new Set(
        products
          .map((p) => p.category)
          .filter((c): c is string => !!c && c.trim() !== ""),
      ),
    ];
    return cats;
  }, [products]);

  // Filtrage
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        search.trim() === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.shortDescription?.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        activeCategory === "tout" || p.category === activeCategory;

      return matchSearch && matchCategory;
    });
  }, [products, search, activeCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
      {/* ── EN-TÊTE ── */}
      <div className="mb-6">
        <h1
          className="text-lg md:text-xl font-medium"
          style={{ color: "var(--color-on-primary)" }}
        >
          Catalogue
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {products.length} produit{products.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── BARRE DE RECHERCHE ── */}
      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-400 transition-colors text-gray-900"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── FILTRES CATÉGORIES ── */}
      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <FilterChip
            label="Tout"
            active={activeCategory === "tout"}
            onClick={() => setActiveCategory("tout")}
            primaryColor={primaryColor}
          />
          {categories.map((cat) => (
            <FilterChip
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              primaryColor={primaryColor}
            />
          ))}
        </div>
      )}

      {/* ── GRILLE PRODUITS ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              storeSlug={store.slug}
              primaryColor={primaryColor}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          search={search}
          onReset={() => {
            setSearch("");
            setActiveCategory("tout");
          }}
          primaryColor={primaryColor}
        />
      )}
    </div>
  );
}

// ── Chip filtre ──

function FilterChip({
  label,
  active,
  onClick,
  primaryColor,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  primaryColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
      style={
        active
          ? {
              backgroundColor: primaryColor,
              color: "var(--color-on-primary)",
              borderColor: primaryColor,
            }
          : {
              backgroundColor: "white",
              color: "#6b7280",
              borderColor: "#e5e7eb",
            }
      }
    >
      {label}
    </button>
  );
}

// ── État vide ──

function EmptyState({
  search,
  onReset,
  primaryColor,
}: {
  search: string;
  onReset: () => void;
  primaryColor: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: `${primaryColor}15` }}
      >
        <SearchIcon className="w-6 h-6" style={{ color: primaryColor }} />
      </div>
      <p className="text-gray-900 font-medium text-sm">
        {search
          ? `Aucun résultat pour "${search}"`
          : "Aucun produit disponible"}
      </p>
      <p className="text-gray-400 text-sm mt-1">
        {search ? "Essayez avec un autre mot-clé" : "Revenez bientôt !"}
      </p>
      {search && (
        <button
          onClick={onReset}
          className="mt-4 text-sm font-medium underline underline-offset-2"
          style={{ color: primaryColor }}
        >
          Réinitialiser la recherche
        </button>
      )}
    </div>
  );
}
