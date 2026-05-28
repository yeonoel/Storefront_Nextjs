interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = await fetchStore(slug);
  if (!store) return { title: "Boutique introuvable" };

  return {
    title: store.name,
    description: store.description || `Bienvenue sur la boutique ${store.name}`,
    openGraph: {
      title: store.name,
      description: store.tagline || store.description || "",
      images: store.bannerUrl ? [{ url: store.bannerUrl }] : [],
    },
  };
}
