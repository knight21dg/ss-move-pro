"use client";

import React, { useEffect, useState } from "react";
import { useSettings } from "@/hooks/use-cms";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

const CLOSED_KEY_PREFIX = "popup_closed:";

export function PopupPoster() {
  const { data: s } = useSettings();
  const popup = s?.popup;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!popup) return;
    if (!popup.is_active) return;
    const id = popup.image_url || s?.hero_images?.home || "default";
    try {
      const closed = localStorage.getItem(CLOSED_KEY_PREFIX + id);
      if (!closed) setVisible(true);
    } catch (e) {
      setVisible(true);
    }
  }, [popup, s]);

  if (!popup || !popup.is_active) return null;
  if (!visible) return null;

  function close() {
    try {
      const keyId = popup?.image_url || "default";
      localStorage.setItem(CLOSED_KEY_PREFIX + keyId, new Date().toISOString());
    } catch (e) {}
    setVisible(false);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={close} />
      <div className="relative max-w-3xl w-full rounded-lg overflow-hidden shadow-lg">
        <img
          src={optimizeCloudinaryUrl(popup.image_url ?? "", 1200)}
          alt="Popup"
          className="w-full h-auto object-cover"
        />
        {popup?.link_url ? (
          <a
            href={popup.link_url}
            target="_blank"
            rel="noreferrer"
            className="absolute inset-0"
            onClick={close}
          />
        ) : null}
        <button
          aria-label="Close"
          onClick={close}
          className="absolute top-3 right-3 bg-white/80 rounded-full p-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
