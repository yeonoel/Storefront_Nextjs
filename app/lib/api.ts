import { Console } from "console";
import { CreateOrderPayload, OrderResponse } from "../types/order";
import { ProductsResponse, ProductDetailResponse } from "../types/product";
import { StoreData } from "../types/store";

const API_URL = process.env.API_URL || "http://localhost:3000/api";

// ── Store ──────────────────────────────────────────────
export async function fetchStore(slug: string): Promise<StoreData | null> {
  try {
    const res = await fetch(`${API_URL}/stores/store/${slug}`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(data);
      throw new Error(JSON.stringify(data));
    }
    return data ?? null;
  } catch {
    return null;
  }
}

// ── Products ───────────────────────────────────────────
export async function fetchProducts(
  storeSlug: string,
  options: {
    page?: number;
    limit?: number;
    featured?: boolean;
    category?: string;
    search?: string;
  } = {},
): Promise<ProductsResponse | null> {
  try {
    const params = new URLSearchParams();
    if (options.page) params.set("page", String(options.page));
    if (options.limit) params.set("limit", String(options.limit));
    if (options.featured) params.set("featured", "true");
    if (options.category) params.set("category", options.category);
    if (options.search) params.set("search", options.search);

    const res = await fetch(
      `${API_URL}/stores/store/${storeSlug}/products?${params.toString()}`,
      { next: { revalidate: 30 } },
    );
    const data = await res.json();
    if (!res.ok) {
      console.log(data);
      throw new Error(JSON.stringify(data));
    }
    return data ?? null;
  } catch {
    return null;
  }
}

export async function fetchProduct(
  storeSlug: string,
  productSlug: string,
): Promise<ProductDetailResponse | null> {
  try {
    const res = await fetch(
      `${API_URL}/stores/store/${storeSlug}/products/${productSlug}`,
      { next: { revalidate: 30 } },
    );
    const data = await res.json();
    if (!res.ok) {
      console.log(data);
      throw new Error(JSON.stringify(data));
    }
    return data ?? null;
  } catch {
    return null;
  }
}

// ── Orders ─────────────────────────────────────────────
export async function createOrder(
  storeSlug: string,
  payload: CreateOrderPayload,
): Promise<OrderResponse | null> {
  try {
    console.log("Creating order with payload:", payload);
    const res = await fetch(`${API_URL}/orders/create/${storeSlug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(data);
      throw new Error(JSON.stringify(data));
    }
    return data ?? null;
  } catch {
    return null;
  }
}
