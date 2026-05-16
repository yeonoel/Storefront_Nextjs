import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchStore, fetchProduct } from "@/app/lib/api";
import ProductPage from "@/app/components/themes/minimal/ProductPage";
import { getPrimaryImage } from "@/app/types/product";

interface Props {
  params: Promise<{ slug: string; productId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, productId } = await params;
  const [store, productRes] = await Promise.all([
    fetchStore(slug),
    fetchProduct(slug, productId),
  ]);

  if (!store || !productRes?.data) return { title: "Produit introuvable" };

  const product = productRes.data;
  const image = getPrimaryImage(product);

  return {
    title: `${product.name} — ${store.name}`,
    description:
      product.shortDescription ||
      product.description ||
      `${product.name} sur ${store.name}`,
    openGraph: {
      title: `${product.name} — ${store.name}`,
      description: product.shortDescription || product.description || "",
      images: image ? [{ url: image.imageUrl, alt: image.altText }] : [],
    },
  };
}

export default async function ProductRoute({ params }: Props) {
  const { slug, productId } = await params;

  const [store, productRes] = await Promise.all([
    fetchStore(slug),
    fetchProduct(slug, productId),
  ]);

  if (!store || store.isDeleted || store.status !== "active") notFound();
  if (
    !productRes?.data ||
    productRes.data.isDeleted ||
    !productRes.data.isActive
  )
    notFound();

  return <ProductPage store={store} product={productRes.data} />;
}
