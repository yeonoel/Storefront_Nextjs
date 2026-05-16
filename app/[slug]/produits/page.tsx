import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchStore, fetchProducts } from "../../lib/api";
import CataloguePage from "../../components/themes/minimal/CataloguePage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = await fetchStore(slug);
  if (!store) return { title: "Catalogue" };
  return {
    title: `Catalogue — ${store.name}`,
    description: `Découvrez tous les produits de ${store.name}`,
  };
}

export default async function CatalogueRoute({ params }: Props) {
  const { slug } = await params;

  const [store, productsRes] = await Promise.all([
    fetchStore(slug),
    fetchProducts(slug, { limit: 100 }),
  ]);

  if (!store || store.isDeleted || store.status !== "active") {
    notFound();
  }

  const products = productsRes?.data ?? [];

  return <CataloguePage store={store} products={products} />;
}
