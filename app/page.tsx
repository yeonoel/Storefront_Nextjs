"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const slug = localStorage.getItem("kernel_last_store_slug");
    if (slug) {
      router.replace(`/${slug}`);
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-sm">Chargement...</p>
    </div>
  );
}
