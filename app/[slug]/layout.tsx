import { notFound } from "next/navigation";
import Navigation from "../components/themes/minimal/Navigation/Navigation";
import Footer from "../components/themes/minimal/Footer/Footer";
import StoreSlugSaver from "../components/shared/StoreSlugSaver";
import { generateThemeVars } from "@/app/types/store";
import { fetchStore } from "../lib/api";

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function StoreLayout({
  children,
  params,
}: RootLayoutProps) {
  const { slug } = await params;

  const store = await fetchStore(slug);
  if (!store || store.isDeleted || store.status !== "active") {
    notFound();
  }
  const theme = generateThemeVars(store.primaryColor || "#1A1A1A");
  return (
    <div
      style={theme as React.CSSProperties}
      className="min-h-screen flex flex-col bg-background text-foreground"
    >
      <StoreSlugSaver store={store} />
      <Navigation store={store} />
      <main className="flex-1">{children}</main>
      <Footer store={store} />
    </div>
  );
}
