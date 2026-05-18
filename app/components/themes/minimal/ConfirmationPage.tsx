import Link from "next/link";
import { StoreData } from "@/app/types/store";

interface ConfirmationPageProps {
  store: StoreData;
  orderId: string;
}

export default function ConfirmationPage({
  store,
  orderId,
}: ConfirmationPageProps) {
  const primaryColor = store.primaryColor || "#1A1A1A";
  const base = `/${store.slug}`;

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      {/* Icône succès */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ backgroundColor: `${primaryColor}15` }}
      >
        <CheckIcon className="w-8 h-8" style={{ color: primaryColor }} />
      </div>

      <h1 className="text-xl font-medium text-gray-900 mb-2">
        Commande enregistrée !
      </h1>

      <p className="text-sm text-gray-500 leading-relaxed mb-2">
        Ta commande a bien été reçue. Le vendeur va te contacter sur WhatsApp
        pour confirmer la livraison.
      </p>

      <p className="text-xs text-gray-400 mb-8">
        Référence :{" "}
        <span className="font-medium text-gray-600">
          #{orderId.slice(0, 8).toUpperCase()}
        </span>
      </p>

      {/* Infos pratiques */}
      <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 mb-8">
        <InfoRow icon={<ClockIcon />} text="Le vendeur te contacte sous 24h" />
        <InfoRow
          icon={<CashIcon />}
          text="Paiement à la livraison — aucun pré-paiement requis"
        />
        <InfoRow
          icon={<WhatsAppIcon />}
          text="Confirmation et suivi via WhatsApp"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Link
          href={`${base}/produits`}
          className="w-full py-3 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: primaryColor }}
        >
          Continuer mes achats
        </Link>
        <Link
          href={base}
          className="w-full py-3 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5">{icon}</span>
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
}

// ── Icons ──

function CheckIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
