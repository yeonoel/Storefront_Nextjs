"use client";

import { useEffect } from "react";
import { StoreData } from "@/app/types/store";

export default function StoreSlugSaver({ store }: { store: StoreData }) {
  useEffect(() => {
    localStorage.setItem("kernel_last_store_slug", store.slug);
    localStorage.setItem("kernel_last_store", JSON.stringify(store));
  }, [store.slug]);

  return null;
}
