import { notFound } from "next/navigation";
import type { Metadata } from "next";
import HomePage from "../components/themes/minimal/Homepage";
import { fetchProducts, fetchStore } from "../lib/api";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function StorePage({ params }: Props) {
  const { slug } = await params;
  const [store, productsRes] = await Promise.all([
    fetchStore(slug),
    fetchProducts(slug, { featured: true, limit: 8 }),
  ]);
  if (!store || store.isDeleted || store.status !== "active") {
    notFound();
  }
  const featuredProducts = productsRes?.data ?? [];
  return <HomePage store={store} featuredProducts={featuredProducts} />;
}
