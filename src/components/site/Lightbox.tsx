"use client";

import React, { createContext, useContext, useState } from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";

type LBContent = { type: "image" | "video"; src: string; title?: string } | null;

const LightboxContext = createContext<{
  open: (c: LBContent) => void;
} | null>(null);

let _open: ((c: LBContent) => void) | null = null;

export function openLightbox(c: LBContent) {
  _open && _open(c);
}

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<LBContent>(null);
  // expose setter to module-level function
  _open = setContent;

  return (
    <LightboxContext.Provider value={{ open: setContent }}>
      {children}
      <Dialog
        open={!!content}
        onOpenChange={(open) => {
          if (!open) setContent(null);
        }}
      >
        <DialogContent className="max-w-4xl w-full sm:rounded-lg p-0 bg-transparent shadow-none">
          <div className="relative bg-black rounded-lg overflow-hidden">
            {content?.type === "image" && (
              <img
                src={content.src}
                alt={content.title ?? ""}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            )}
            {content?.type === "video" && (
              <div className="w-full h-0 pb-[56.25%] relative">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={content.src}
                  title={content.title ?? "video"}
                  frameBorder={0}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within LightboxProvider");
  return ctx;
}
