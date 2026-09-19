"use client";

import { useEffect } from "react";
import { assetUrl } from "@/lib/site";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(assetUrl("/sw.js"), { scope: assetUrl("/") }).catch(() => undefined);
  }, []);

  return null;
}
