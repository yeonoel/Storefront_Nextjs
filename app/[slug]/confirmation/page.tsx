import { notFound } from "next/navigation";
import { fetchStore } from "@/app/lib/api";
import ConfirmationPage from "@/app/components/themes/minimal/ConfirmationPage";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ orderId?: string }>;
}

export default async function ConfirmationRoute({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const { orderId } = await searchParams;

  if (!orderId) notFound();

  const store = await fetchStore(slug);
  if (!store || store.isDeleted || store.status !== "active") notFound();

  return <ConfirmationPage store={store} orderId={orderId} />;
}
