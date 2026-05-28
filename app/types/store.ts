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

export interface ThemeVars {
  "--background": string;
  "--foreground": string;
  "--primary": string;
  "--primary-hover": string;
  "--primary-light": string;
  "--primary-foreground": string;
  "--muted": string;
  "--border": string;
  "--card": string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
      .join("")
  );
}

function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function darken(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = 1 - amount;
  return rgbToHex(
    Math.round(r * factor),
    Math.round(g * factor),
    Math.round(b * factor),
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Génère les variables CSS pour un thème donné
export function generateThemeVars(primaryColor: string): ThemeVars {
  const luminance = getLuminance(primaryColor);
  const primaryForeground = luminance > 0.5 ? "#1A1A1A" : "#FFFFFF";

  return {
    "--background": "#ffffff",
    "--foreground": "#1a1a1a",
    "--primary": primaryColor,
    "--primary-hover": darken(primaryColor, 0.1),
    "--primary-light": hexToRgba(primaryColor, 0.08),
    "--primary-foreground": primaryForeground,
    "--muted": "#f3f4f6",
    "--border": "#e5e7eb",
    "--card": "#ffffff",
  };
}

export function getTextOnPrimary(hex: string): string {
  return getLuminance(hex) > 0.5 ? "#1A1A1A" : "#FFFFFF";
}
