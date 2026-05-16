export interface ProductImage {
  id: string;
  imageUrl: string;
  altText: string;
  isPrimary: boolean;
  displayOrder: number;
  createdAt?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  color: string | null;
  size: string | null;
  material: string | null;
  price: string | null;
  stockQuantity: number;
  reservedQuantity: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  images: ProductImage[];
  variants: ProductVariant[];
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: string;
  compareAtPrice?: string | null;
  costPrice?: string | null;
  sku?: string;
  stockQuantity?: number;
  reservedQuantity?: number;
  lowStockThreshold?: number;
  isActive?: boolean;
  isDeleted?: boolean;
  isFeatured?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  weight?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  createdAt?: string;
  updatedAt?: string;
  isOnSale?: boolean;
  discountPercentage?: number;
  isLowStock?: boolean;
  isOutOfStock?: boolean;
  category?: string | null;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  data: Product;
}

// Utilitaires
export function getPrimaryImage(product: Product): ProductImage | null {
  if (!product.images?.length) return null;
  return (
    product.images.find((img) => img.isPrimary) ||
    product.images.sort((a, b) => a.displayOrder - b.displayOrder)[0]
  );
}

export function getAvailableStock(variant: ProductVariant): number {
  return Math.max(0, variant.stockQuantity - variant.reservedQuantity);
}

export function isVariantAvailable(variant: ProductVariant): boolean {
  return (
    variant.isActive && !variant.isDeleted && getAvailableStock(variant) > 0
  );
}

export function getVariantPrice(
  variant: ProductVariant,
  productPrice: string,
): string {
  return variant.price ?? productPrice;
}

export function formatPrice(price: string | number): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return (
    new Intl.NumberFormat("fr-CI", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(num) + " FCFA"
  );
}
