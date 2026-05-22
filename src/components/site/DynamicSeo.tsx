"use client";

import { useEffect, useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useSettings, type SeoFields, useServices } from "@/hooks/use-cms";

const PAGE_KEYS = ["home", "about", "services", "gallery", "videos", "enquiry", "contact"] as const;

function setMeta(tag: { name?: string; property?: string; content: string }) {
  if (typeof document === "undefined") return;
  const selector = tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`;
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

function setLink(rel: string, href: string) {
  if (typeof document === "undefined") return;
  const selector = `link[rel="${rel}"]`;
  const existing = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (existing) {
    existing.href = href;
    return;
  }
  const link = document.createElement("link");
  link.rel = rel;
  link.href = href;
  document.head.appendChild(link);
}

function setLdJson(id: string, obj: any | null) {
  if (typeof document === "undefined") return;
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  if (!obj) return;
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.id = id;
  s.text = JSON.stringify(obj);
  document.head.appendChild(s);
}

function buildSeo(defaults: SeoFields, page?: Partial<SeoFields>) {
  return { ...defaults, ...(page ?? {}) };
}

export function DynamicSeo() {
  const { data: s } = useSettings();
  const { data: services = [] } = useServices(false);
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

    // canonical
    try {
      const canonical = `${window.location.origin}${pathname}`;
      setLink("canonical", canonical);
    } catch (e) {}

    // robots
    setMeta({ name: "robots", content: "index,follow" });

    // LocalBusiness structured data
    const localBusiness: any = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: (s?.seo?.default?.title as string) || tags.title,
      description: tags.description,
      telephone: s?.contact?.phone || undefined,
      image: tags.og_image || undefined,
      url: typeof window !== "undefined" ? window.location.origin : undefined,
    };
    setLdJson("ld-json-localbusiness", localBusiness);

    // FAQ structured data on home
    if (pathname === "/" && s?.home_faqs?.items?.length) {
      const faqs = s.home_faqs.items.map((f: any) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      }));
      setLdJson("ld-json-faq", {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs,
      });
    } else {
      setLdJson("ld-json-faq", null);
    }

    // Services structured data on services page
    if (pathname.startsWith("/services") && services.length) {
      const svc = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: s?.seo?.default?.title ?? undefined,
        serviceType: services
          .map((sv: any) => sv.title)
          .slice(0, 10)
          .join(", "),
      };
      setLdJson("ld-json-services", svc);
    } else {
      setLdJson("ld-json-services", null);
    }
  }, [tags]);

  return null;
}

function srcIncludes<T>(arr: readonly T[], val: T): boolean {
  return arr.includes(val as any);
}
