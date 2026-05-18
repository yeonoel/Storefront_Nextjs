"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StoreData } from "@/app/types/store";
import { Product, ProductVariant, getVariantPrice } from "@/app/types/product";
import { createOrder } from "@/app/lib/api";
import { buildOrderWhatsAppUrl } from "@/app/lib/whatsapp";
import { formatPrice } from "@/app/lib/utils";
import { SpinnerIcon, WhatsAppIcon } from "@/app/components/Icons/icons";

interface CommandeItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CommandePageProps {
  store: StoreData;
  item: CommandeItem;
}

export default function CommandePage({ store, item }: CommandePageProps) {
  const router = useRouter();
  const primaryColor = store?.primaryColor || "#1A1A1A";
  const base = `/${store?.slug}`;

  console.log("CommandePage render", { item });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    neighborhood: "",
    city: "Abidjan",
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const price = getVariantPrice(item?.variant, item?.product.price);
  const total = parseFloat(price) * item?.quantity;

  function validate(): boolean {
    const newErrors: Partial<typeof form> = {};
    if (!form.name.trim()) newErrors.name = "Ton prénom est requis";
    if (!form.phone.trim()) newErrors.phone = "Ton numéro est requis";
    else if (!/^[\d\s+\-()]{8,20}$/.test(form.phone.trim()))
      newErrors.phone = "Numéro invalide";
    if (!form.city.trim()) newErrors.city = "La ville est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    setServerError(null);

    const orderRes = await createOrder(store.slug, {
      address: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        neighborhood: form.neighborhood.trim() || undefined,
        city: form.city.trim(),
      },
      paymentMethod: "cash",
      items: [
        {
          variantId: item?.variant.id,
          productId: item?.product.id,
          quantity: item?.quantity,
        },
      ],
    });

    if (!orderRes?.data) {
      setServerError("Une erreur est survenue. Réessaie.");
      setLoading(false);
      return;
    }

    const order = orderRes.data;

    // Ouvrir WhatsApp avec message pré-rempli
    if (store.whatsappNumber) {
      const waUrl = buildOrderWhatsAppUrl(store.whatsappNumber, {
        orderId: order.id,
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        city: form.city.trim(),
        neighborhood: form.neighborhood.trim() || undefined,
        storeName: store.name,
        total,
        items: [
          {
            productName: item?.product.name,
            color: item?.variant.color,
            size: item?.variant.size,
            quantity: item.quantity,
            price,
          },
        ],
      });
      window.open(waUrl, "_blank");
    }

    // Rediriger vers confirmation
    router.push(`${base}/confirmation?orderId=${order.id}`);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 md:py-10">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link href={base} className="hover:text-gray-600 transition-colors">
          Accueil
        </Link>
        <span>/</span>
        <Link
          href={`${base}/produits`}
          className="hover:text-gray-600 transition-colors"
        >
          Catalogue
        </Link>
        <span>/</span>
        <span className="text-gray-600">Commande</span>
      </nav>

      <h1 className="text-lg font-medium text-gray-900 mb-6">
        Finaliser la commande
      </h1>

      {/* ── Récap produit ── */}
      <div className="border border-gray-100 rounded-xl p-4 mb-6">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          Récapitulatif
        </p>
        <div className="flex gap-3 items-start">
          {item?.product.images[0] ? (
            <img
              src={item?.product.images[0].imageUrl}
              alt={item?.product.name}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-50"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {item?.product.name}
            </p>
            <div className="flex flex-wrap gap-x-3 mt-0.5">
              {item?.variant.color && (
                <span className="text-xs text-gray-500">
                  Couleur : {item?.variant.color}
                </span>
              )}
              {item?.variant.size && (
                <span className="text-xs text-gray-500">
                  Taille : {item?.variant.size}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Qté : {item?.quantity}
            </p>
          </div>
          <p
            className="text-sm font-medium flex-shrink-0"
            style={{ color: primaryColor }}
          >
            {formatPrice(price)}
          </p>
        </div>
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <span className="text-sm text-gray-500">Total</span>
          <span
            className="text-base font-medium"
            style={{ color: primaryColor }}
          >
            {formatPrice(String(total))}
          </span>
        </div>
      </div>

      {/* ── Formulaire ── */}
      <div className="space-y-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Tes informations
        </p>

        <Field
          label="Prénom / Nom"
          required
          error={errors.name}
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          placeholder="Ex : Kouamé Yao"
        />

        <Field
          label="Numéro de téléphone"
          required
          error={errors.phone}
          value={form.phone}
          onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
          placeholder="+225 07 XX XX XX XX"
          type="tel"
        />

        <Field
          label="Quartier"
          error={errors.neighborhood}
          value={form.neighborhood}
          onChange={(v) => setForm((f) => ({ ...f, neighborhood: v }))}
          placeholder="Ex : Cocody, Yopougon, Abobo..."
        />

        <Field
          label="Ville"
          required
          error={errors.city}
          value={form.city}
          onChange={(v) => setForm((f) => ({ ...f, city: v }))}
          placeholder="Abidjan"
        />
      </div>

      {/* Erreur serveur */}
      {serverError && (
        <p className="mt-4 text-sm text-red-500 text-center">{serverError}</p>
      )}

      {/* ── CTA ── */}
      <div className="mt-8">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: "#25D366" }}
        >
          {loading ? (
            <>
              <SpinnerIcon className="w-4 h-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <WhatsAppIcon className="w-5 h-5" />
              Confirmer sur WhatsApp
            </>
          )}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">
          Ta commande sera enregistrée · Confirmation via WhatsApp · Paiement à
          la livraison
        </p>
      </div>
    </div>
  );
}

// ── Champ formulaire ──
function Field({
  label,
  required,
  error,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 text-sm text-gray-700 border rounded-xl outline-none transition-colors ${
          error
            ? "border-red-300 bg-red-50"
            : "border-gray-200 bg-gray-50 focus:border-gray-400"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
