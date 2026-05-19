import { useEffect, useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useSettings, type SeoFields } from "@/hooks/use-cms";

const PAGE_KEYS = ["home", "about", "services", "gallery", "videos", "enquiry", "contact"] as const;

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
  const seo = s?.seo ?? null;

  const tags = useMemo(() => {
    if (!seo || pathname.startsWith("/admin")) return null;
    const key = srcIncludes(PAGE_KEYS, pathname.slice(1)) ? pathname.slice(1) : null;
    const pageSeo = key ? (seo.pages?.[key] ?? undefined) : undefined;
    return buildSeo(seo.default ?? ({} as SeoFields), pageSeo);
  }, [pathname, seo]);

  useEffect(() => {
    if (!tags) return;
    document.title = tags.title;
    setMeta({ name: "description", content: tags.description });
    setMeta({ name: "keywords", content: tags.keywords });
    setMeta({ property: "og:title", content: tags.title });
    setMeta({ property: "og:description", content: tags.description });
    setMeta({ property: "og:image", content: tags.og_image });
    setMeta({ name: "twitter:title", content: tags.title });
    setMeta({ name: "twitter:description", content: tags.description });
    setMeta({ name: "twitter:image", content: tags.og_image });
  }, [tags]);

  return null;
}

function srcIncludes<T>(arr: readonly T[], val: T): boolean {
  return arr.includes(val as any);
}
