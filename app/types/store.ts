export interface StoreData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  whatsappNumber?: string;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor?: string;
  tagline?: string;
  storeUrl?: string;
  status: "active" | "suspended" | "pending";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    firstName?: string;
    lastName?: string;
    phone: string;
    role: string;
  };
}

// Utilitaires
export function getStoreInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStorePrimaryColor(store: StoreData): string {
  return store.primaryColor || "#1A1A1A";
}

export function getStoreTagline(store: StoreData): string {
  return store.tagline || "Bienvenue dans notre boutique";
}

export function formatWhatsAppNumber(number: string): string {
  // Normalise vers format international sans +
  return number.replace(/\D/g, "");
}

export function buildWhatsAppUrl(
  whatsappNumber: string,
  message: string,
): string {
  const number = formatWhatsAppNumber(whatsappNumber);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}
