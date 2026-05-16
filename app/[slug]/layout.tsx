import { notFound } from "next/navigation";
import Navigation from "../components/themes/minimal/Navigation/Navigation";
import Footer from "../components/themes/minimal/Footer/Footer";
import { fetchStore } from "../lib/api";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await fetchStore(slug);

  if (!store || store.isDeleted || store.status !== "active") {
    notFound();
  }

  const primaryColor = store.primaryColor || "#1A1A1A";

  return (
    // Injecte la couleur primaire comme variable CSS pour toute la boutique
    <div
      style={{ "--color-primary": primaryColor } as React.CSSProperties}
      className="min-h-screen flex flex-col bg-white"
    >
      <Navigation store={store} />
      <main className="flex-1">{children}</main>
      <Footer store={store} />
    </div>
  );
}
