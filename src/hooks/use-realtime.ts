import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { subscribeRealtime } from "@/lib/firebase";

export function useRealtime() {
  const qc = useQueryClient();
  const qcRef = useRef(qc);
  qcRef.current = qc;

  useEffect(() => {
    const qcProxy = {
      invalidateQueries: (opts: any) => {
        qcRef.current.invalidateQueries(opts);
      },
    };
    const unsub = subscribeRealtime(qcProxy as any);
    return () => {
      unsub();
    };
  }, []);
}

