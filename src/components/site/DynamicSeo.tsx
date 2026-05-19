import { useEffect, useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import { DEFAULT_SETTINGS, useSettings, type SeoFields } from "@/hooks/use-cms";

const PAGE_KEYS: Record<string, keyof typeof DEFAULT_SETTINGS.seo.pages> = {
  "/": "home",
  "/about": "about",
  "/services": "services",
  "/gallery": "gallery",
  "/videos": "videos",
  "/enquiry": "enquiry",
  "/contact": "contact",
};

function setMeta(tag: { name?: string; property?: string; content: string }) {
  if (typeof document === "undefined") return;
  const selector = tag.name
    ? `meta[name="${tag.name}"]`
    : `meta[property="${tag.property}"]`;
  const existing = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (existing) {
    existing.setAttribute("content", tag.content);
    return;
  }
  const meta = document.createElement("meta");
  if (tag.name) meta.setAttribute("name", tag.name);
  if (tag.property) meta.setAttribute("property", tag.property);
  meta.setAttribute("content", tag.content);
  document.head.appendChild(meta);
}

function buildSeo(defaults: SeoFields, page?: Partial<SeoFields>) {
  return { ...defaults, ...(page ?? {}) };
}

export function DynamicSeo() {
  const { data: s } = useSettings();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const seo = useMemo(() => {
    if (pathname.startsWith("/admin")) return null;
    const settings = s ?? DEFAULT_SETTINGS;
    const key = PAGE_KEYS[pathname];
    const pageSeo = key ? settings.seo.pages[key] : undefined;
    return buildSeo(settings.seo.default, pageSeo);
  }, [pathname, s]);

  useEffect(() => {
    if (!seo || typeof document === "undefined") return;
    document.title = seo.title;
    setMeta({ name: "description", content: seo.description });
    setMeta({ name: "keywords", content: seo.keywords });
    setMeta({ property: "og:title", content: seo.title });
    setMeta({ property: "og:description", content: seo.description });
    setMeta({ property: "og:image", content: seo.og_image });
    setMeta({ name: "twitter:title", content: seo.title });
    setMeta({ name: "twitter:description", content: seo.description });
    setMeta({ name: "twitter:image", content: seo.og_image });
  }, [seo]);

  return null;
}
