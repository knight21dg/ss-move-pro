import { useEffect, useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, runTransaction, collection, query, where, getDocs, addDoc, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import type { SiteSettings, AppDoc } from "@/hooks/use-cms";
import { EMPTY_SETTINGS } from "@/hooks/use-cms";

// ─ ALL home item types ────────────────────────────────────────────────────────

export type WhyUsItem = { id: string; title: string; description: string; sort_order: number };
export type ProcessItem = { id: string; step: string; title: string; description: string; sort_order: number };
export type FaqItem = { id: string; question: string; answer: string; sort_order: number };

// ─ Shapes inside the singleton doc ───────────────────────────────────────────

type HeroSettings = { badge?: string; title: string; subtitle: string; cta: string };
type HeroImagesSettings = { home: string; about: string; services: string; gallery: string; videos: string; enquiry: string; contact: string };
type AboutSettings = SiteSettings["about"];
type ContactSettings = SiteSettings["contact"];
type SocialSettings = SiteSettings["social"];
type CtaSettings = SiteSettings["cta"];
type FooterSettings = SiteSettings["footer"];
type DefaultSeoSettings = { site_title: string; site_description: string; site_keywords: string; og_image: string };

// ─ Firestore singleton doc ────────────────────────────────────────────────────

const ALL_DOC = doc(db, "settings", "all");

function writeTimestamp(): string {
  return new Date().toISOString();
}

async function loadDoc(): Promise<AppDoc | null> {
  const snap = await getDoc(ALL_DOC);
  return snap.exists() ? (snap.data() as AppDoc) : null;
}

async function saveDoc(data: AppDoc): Promise<void> {
  await setDoc(ALL_DOC, { ...data, updated_at: writeTimestamp() }, { merge: true });
}

// ─ atomic helper ─────────────────────────────────────────────────────────────

export async function saveHomeSectionInDoc(
  key: keyof AppDoc["home_why_us"] | keyof AppDoc["home_process"] | keyof AppDoc["home_faqs"],
  eyebrow: string,
  title: string,
  items: WhyUsItem[] | ProcessItem[] | FaqItem[],
): Promise<void> {
  const patch: Record<string, any> = {
    [`home_${key}`]: { eyebrow, title, items },
    updated_at: writeTimestamp(),
  };
  await updateDoc(ALL_DOC, patch);
}

export async function saveSeoPage(page_key: string, fields: { title: string; description: string; keywords: string; og_image: string }): Promise<void> {
  await setDoc(doc(db, "seo_page_settings", page_key), { ...fields, page_key }, { merge: true });
}

export async function deleteSeoPage(page_key: string): Promise<void> {
  await deleteDoc(doc(db, "seo_page_settings", page_key));
}

// ═══════════════════════════════════════════════════════════════════════════════════
export function useSettingsForm() {
  const qc = useQueryClient();
  const [form, _setFormRaw] = useState<SiteSettings>({ ...EMPTY_SETTINGS } as any);
  const isLoaded = useRef(false);

  // populate form from settings doc
  useEffect(() => {
    (async () => {
      const d = await loadDoc();
      if (!d || isLoaded.current) return;
      isLoaded.current = true;
      _setFormRaw(fromDoc(d));
    })();
  }, []);

  const setForm = (updater: SiteSettings | ((prev: SiteSettings) => SiteSettings)) => {
    if (typeof updater === "function") {
      _setFormRaw((prev) => (updater as (s: SiteSettings) => SiteSettings)(prev));
    } else {
      _setFormRaw(updater);
    }
  };

  const save = useMutation({
    mutationFn: async (): Promise<void> => {
      const fd = await loadDoc();

      // ── hero ──
      const heroPatch: HeroSettings = {
        badge: (form.hero.badge ?? fd?.hero?.badge ?? "") as string,
        title: form.hero.title,
        subtitle: form.hero.subtitle,
        cta: form.hero.cta,
      };

      // ── hero images ──
      const heroImagesPatch: HeroImagesSettings = { ...form.hero_images };

      // ── about ──
      const aboutPatch = { ...form.about };

      // ── contact ──
      const contactPatch = { ...form.contact };

      // ── social ──
      const socialPatch = { ...form.social };

      // ── cta ──
      const ctaPatch = { ...form.cta };

      // ── footer ──
      const footerPatch = { ...form.footer };

      // ── seo default ──
      const seoDefaultPatch: DefaultSeoSettings = {
        site_title: form.seo.default.title,
        site_description: form.seo.default.description,
        site_keywords: form.seo.default.keywords,
        og_image: form.seo.default.og_image,
      };

      // build app doc
      const appDocPayload: AppDoc = {
        hero: heroPatch,
        hero_images: heroImagesPatch,
        home_why_us: { eyebrow: form.home_why_us.eyebrow, title: form.home_why_us.title, items: form.home_why_us.items },
        home_process: { eyebrow: form.home_process.eyebrow, title: form.home_process.title, items: form.home_process.items },
        home_faqs: { eyebrow: form.home_faqs.eyebrow, title: form.home_faqs.title, items: form.home_faqs.items },
        about: aboutPatch,
        contact: contactPatch,
        social: socialPatch,
        cta: ctaPatch,
        footer: footerPatch,
        seo_default: seoDefaultPatch,
        ga: { measurement_id: (fd?.ga as any)?.measurement_id ?? "" },
        updated_at: writeTimestamp(),
      };

      await saveDoc(appDocPayload);

      // ── seo pages (individual docs) ──
      const pages = form.seo.pages;
      const pageKeys = Object.keys(pages);
      const batchArr: Promise<any>[] = [];
      // delete pages not in form
      const existingSnap = await getDocs(query(collection(db, "seo_page_settings"), orderBy("page_key", "asc")));
      const existingKeys = existingSnap.docs.map((d) => d.id);
      for (const k of existingKeys) {
        if (!pageKeys.includes(k) && isDefaultSeoPage(k)) continue; // skip homepage default collapse
        if (!pageKeys.includes(k)) batchArr.push(deleteDoc(doc(db, "seo_page_settings", k)));
      }
      // upsert pages in form
      for (const [key, val] of Object.entries(pages)) {
        batchArr.push(setDoc(doc(db, "seo_page_settings", key), { page_key: key, ...val }, { merge: true }));
      }
      await Promise.all(batchArr);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hero_settings"], exact: false });
      qc.invalidateQueries({ queryKey: ["hero_images_settings"], exact: false });
      qc.invalidateQueries({ queryKey: ["home_why_us_settings"], exact: false });
      qc.invalidateQueries({ queryKey: ["home_process_settings"], exact: false });
      qc.invalidateQueries({ queryKey: ["home_faqs_settings"], exact: false });
      qc.invalidateQueries({ queryKey: ["about_settings"], exact: false });
      qc.invalidateQueries({ queryKey: ["contact_settings"], exact: false });
      qc.invalidateQueries({ queryKey: ["social_settings"], exact: false });
      qc.invalidateQueries({ queryKey: ["cta_settings"], exact: false });
      qc.invalidateQueries({ queryKey: ["footer_settings"], exact: false });
      qc.invalidateQueries({ queryKey: ["seo_default_settings"], exact: false });
      qc.invalidateQueries({ queryKey: ["seo_page_settings"], exact: false });
      toast.success("Saved");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Failed to save"),
  });

  return { form, setForm, isLoading: !isLoaded.current, save };
}

// ─── Private helpers ──────────────────────────────────────────────────────────

const DEFAULT_SEO_PAGES = new Set(["home", "about", "services", "gallery", "videos", "enquiry", "contact"]);

function isDefaultSeoPage(key: string): boolean {
  return DEFAULT_SEO_PAGES.has(key);
}

function fromDoc(d: AppDoc): SiteSettings {
  const s = (d as any);
  return {
    hero: { badge: s.hero?.badge ?? "", title: s.hero?.title ?? "", subtitle: s.hero?.subtitle ?? "", cta: s.hero?.cta ?? "" },
    hero_images: s.hero_images ?? {},
    home_why_us: { eyebrow: s.home_why_us?.eyebrow ?? "", title: s.home_why_us?.title ?? "", items: (s.home_why_us?.items ?? []) as any },
    home_process: { eyebrow: s.home_process?.eyebrow ?? "", title: s.home_process?.title ?? "", items: (s.home_process?.items ?? []) as any },
    home_faqs: { eyebrow: s.home_faqs?.eyebrow ?? "", title: s.home_faqs?.title ?? "", items: (s.home_faqs?.items ?? []) as any },
    about: s.about ?? EMPTY_SETTINGS.about,
    contact: s.contact ?? EMPTY_SETTINGS.contact,
    social: s.social ?? EMPTY_SETTINGS.social,
    cta: s.cta ?? EMPTY_SETTINGS.cta,
    footer: s.footer ?? EMPTY_SETTINGS.footer,
    seo: {
      default: {
        title: s.seo_default?.site_title ?? "",
        description: s.seo_default?.site_description ?? "",
        keywords: s.seo_default?.site_keywords ?? "",
        og_image: s.seo_default?.og_image ?? "",
      },
      pages: {},
    },
  };
}
