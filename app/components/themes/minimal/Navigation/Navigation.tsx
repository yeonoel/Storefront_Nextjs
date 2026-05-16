"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  WhatsAppIcon,
  HomeIcon,
  GridIcon,
  CartIcon,
} from "../../../Icons/icons";
import {
  StoreData,
  getStoreInitials,
  buildWhatsAppUrl,
} from "@/app/types/store";

interface NavProps {
  store: StoreData;
}

export default function Navigation({ store }: NavProps) {
  const pathname = usePathname();
  const base = `/${store.slug}`;
  const primaryColor = store.primaryColor || "#1A1A1A";

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* ── DESKTOP NAV ── */}
      <header className="hidden md:flex sticky top-0 z-50 items-center justify-between px-8 h-16 border-b border-gray-100 bg-white">
        {/* Logo + nom */}
        <Link href={base} className="flex items-center gap-3">
          {store.logoUrl ? (
            <img
              src={store.logoUrl}
              alt={store.name}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              {getStoreInitials(store.name)}
            </div>
          )}
          <span className="font-medium text-gray-900 text-[15px]">
            {store.name}
          </span>
        </Link>

        {/* Liens centre */}
        <nav className="flex items-center gap-8">
          <Link
            href={base}
            className="text-sm transition-colors"
            style={{ color: isActive(base) ? primaryColor : "#6b7280" }}
          >
            Accueil
          </Link>
          <Link
            href={`${base}/produits`}
            className="text-sm transition-colors"
            style={{
              color: isActive(`${base}/produits`) ? primaryColor : "#6b7280",
            }}
          >
            Catalogue
          </Link>
          {store.whatsappNumber && (
            <a
              href={buildWhatsAppUrl(
                store.whatsappNumber,
                `Bonjour, j'ai une question sur votre boutique ${store.name}`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Contact
            </a>
          )}
        </nav>

        {/* Actions droite */}
        <div className="flex items-center gap-4">
          {/* Bouton WhatsApp */}
          {store.whatsappNumber && (
            <a
              href={buildWhatsAppUrl(
                store.whatsappNumber,
                `Bonjour, j'ai une question sur votre boutique ${store.name}`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white px-4 py-2 rounded-full transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#25D366" }}
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>
      </header>

      {/* ── MOBILE : top bar ── */}
      <header className="md:hidden sticky top-0 z-50 flex items-center justify-between px-4 h-14 border-b border-gray-100 bg-white">
        <Link href={base} className="flex items-center gap-2.5">
          {store.logoUrl ? (
            <img
              src={store.logoUrl}
              alt={store.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              {getStoreInitials(store.name)}
            </div>
          )}
          <span className="font-medium text-gray-900 text-sm">
            {store.name}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {store.whatsappNumber && (
            <a
              href={buildWhatsAppUrl(
                store.whatsappNumber,
                `Bonjour, j'ai une question sur ${store.name}`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#25D366" }}
              aria-label="Contacter sur WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
            </a>
          )}
          <Link
            href={`${base}/panier`}
            className="relative flex items-center justify-center w-8 h-8"
            aria-label="Panier"
          ></Link>
        </div>
      </header>

      {/* ── MOBILE : bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex items-center justify-around h-16 px-4">
        <MobileNavItem
          href={base}
          label="Accueil"
          active={isActive(base)}
          primaryColor={primaryColor}
          icon={<HomeIcon />}
        />
        <MobileNavItem
          href={`${base}/produits`}
          label="Catalogue"
          active={pathname.startsWith(`${base}/produits`)}
          primaryColor={primaryColor}
          icon={<GridIcon />}
        />
      </nav>

      {/* Spacer pour éviter que le bottom nav cache le contenu */}
      <div className="md:hidden h-16" />
    </>
  );
}

function MobileNavItem({
  href,
  label,
  active,
  primaryColor,
  icon,
  badge,
}: {
  href: string;
  label: string;
  active: boolean;
  primaryColor: string;
  icon: React.ReactNode;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-0.5 relative"
      style={{ color: active ? primaryColor : "#9ca3af" }}
    >
      <span className="w-6 h-6 flex items-center justify-center">
        {React.cloneElement(
          icon as React.ReactElement<{ className?: string }>,
          {
            className: "w-6 h-6",
          },
        )}
      </span>
      {badge !== undefined && (
        <span
          className="absolute -top-0.5 right-1 text-white text-[9px] font-medium w-3.5 h-3.5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: primaryColor }}
        >
          {badge > 9 ? "9+" : badge}
        </span>
      )}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
