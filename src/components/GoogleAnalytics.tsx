import { useEffect, useState } from "react";
import { getGaId } from "@/lib/firebase";

export function GoogleAnalytics() {
  const [gaMeasurementId, setGaMeasurementId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getGaId()
      .then((id) => {
        if (active && id) {
          setGaMeasurementId(id);
        }
      })
      .catch((err) => {
        console.error("Error loading GA ID:", err);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!gaMeasurementId) return;

    // Check if script is already injected
    if (document.getElementById("ga-gtag-script")) return;

    // Inject gtag.js
    const script = document.createElement("script");
    script.id = "ga-gtag-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
    document.head.appendChild(script);

    // Inject config script
    const inlineScript = document.createElement("script");
    inlineScript.id = "ga-init-script";
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaMeasurementId}');
    `;
    document.head.appendChild(inlineScript);

    return () => {
      const s = document.getElementById("ga-gtag-script");
      const is = document.getElementById("ga-init-script");
      if (s) s.remove();
      if (is) is.remove();
    };
  }, [gaMeasurementId]);

  return null;
}

