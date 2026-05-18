export interface CreateOrderPayload {
  address?: {
    name?: string;
    phone: string;
    city?: string;
    neighborhood?: string;
  };
  paymentMethod?: "cash" | "card";
  items: {
    variantId: string;
    productId: string;
    quantity: number;
  }[];
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: string;
    total: string;
    items: {
      id: string;
      productName: string;
      variantName?: string;
      color?: string;
      size?: string;
      quantity: number;
      price: string;
    }[];
    address?: {
      name?: string;
      phone: string;
      city?: string;
      neighborhood?: string;
    };
    createdAt: string;
  };
}
