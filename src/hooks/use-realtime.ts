import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { subscribeRealtime } from "@/lib/firebase";

export function useRealtime() {
  const qc = useQueryClient();
  useEffect(() => {
    const unsub = subscribeRealtime(qc as any);
    return () => { unsub(); };
  }, [qc]);
}
