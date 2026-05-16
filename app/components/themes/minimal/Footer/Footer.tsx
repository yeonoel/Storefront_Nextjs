import Link from "next/link";
import {
  StoreData,
  getStoreInitials,
  buildWhatsAppUrl,
} from "@/app/types/store";
import { WhatsAppIcon } from "../../../Icons/icons";

interface FooterProps {
  store: StoreData;
}

export default function Footer({ store }: FooterProps) {
  const base = `/${store.slug}`;
  const primaryColor = store.primaryColor || "#1A1A1A";
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Colonne 1 — Identité boutique */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {store.logoUrl ? (
                <img
                  src={store.logoUrl}
                  alt={store.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  {getStoreInitials(store.name)}
                </div>
              )}
              <span className="font-medium text-gray-900">{store.name}</span>
            </div>
            {store.description && (
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                {store.description}
              </p>
            )}
            {/* Badge Kernel */}
            <p className="text-xs text-gray-400">
              Boutique propulsée par{" "}
              <a
                href="https://kernelaap.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: primaryColor }}
              >
                Kernel
              </a>
            </p>
          </div>

          {/* Colonne 2 — Navigation */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              Navigation
            </p>
            <Link
              href={base}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors w-fit"
            >
              Accueil
            </Link>
            <Link
              href={`${base}/produits`}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors w-fit"
            >
              Catalogue
            </Link>
          </div>

          {/* Colonne 3 — Contact */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              Contact
            </p>
            {store.whatsappNumber ? (
              <a
                href={buildWhatsAppUrl(
                  store.whatsappNumber,
                  `Bonjour, j'ai une question sur votre boutique ${store.name}`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white px-4 py-2.5 rounded-full w-fit transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#25D366" }}
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Nous contacter</span>
              </a>
            ) : (
              <p className="text-sm text-gray-400">Aucun contact disponible</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Commandes confirmées via WhatsApp · Paiement à la livraison
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {year} {store.name}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={`${base}/mentions-legales`}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              href={`${base}/politique-confidentialite`}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
