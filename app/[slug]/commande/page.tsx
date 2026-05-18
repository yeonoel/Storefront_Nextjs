import { notFound } from "next/navigation";
import { fetchStore, fetchProduct } from "@/app/lib/api";
import CommandePage from "@/app/components/themes/minimal/CommandePage";
import { ProductVariant } from "@/app/types/product";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    productSlug?: string;
    variantId?: string;
    quantity?: string;
  }>;
}

export default async function CommandeRoute({ params, searchParams }: Props) {
  const { slug } = await params;
  const { productSlug, variantId, quantity } = await searchParams;

  if (!productSlug || !variantId) notFound();

  const [store, productRes] = await Promise.all([
    fetchStore(slug),
    fetchProduct(slug, productSlug),
  ]);

  if (!store || store.isDeleted || store.status !== "active") notFound();
  if (!productRes?.data) notFound();

  const product = productRes.data;
  const variant = product.variants.find(
    (v: ProductVariant) => v.id === variantId,
  );
  if (!variant) notFound();

  return (
    <CommandePage
      store={store}
      item={{
        product,
        variant,
        quantity: quantity ? parseInt(quantity) : 1,
      }}
    />
  );
}
