"use client";

import { useCallback, useEffect, useState } from "react";
import { onWalletRefresh } from "./walletEvents";

export function useWalletBalance() {
  const [balance, setBalance] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/me", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setBalance(data.walletBalance);
    }
  }, []);

  useEffect(() => {
    refresh();
    const offRefresh = onWalletRefresh(refresh);
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      offRefresh();
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  return { balance, refresh };
}
