export function formatPrice(price: string | number): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return (
    new Intl.NumberFormat("fr-CI", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(num) + " FCFA"
  );
}

export function getTextOnPrimary(primaryColor: string): string {
  // Calcule si le fond est clair ou sombre
  const hex = primaryColor.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  // Formule luminosité perçue
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1A1A1A" : "#FFFFFF";
}
