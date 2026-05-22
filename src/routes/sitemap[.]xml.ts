import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const BASE_URL = import.meta.env.VITE_SITE_URL || "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // static paths
        const staticPaths = [
          "/",
          "/about",
          "/services",
          "/gallery",
          "/videos",
          "/enquiry",
          "/contact",
        ];

        // include SEO page settings (city pages etc.)
        let seoPaths: string[] = [];
        try {
          const snap = await getDocs(collection(db, "seo_page_settings"));
          seoPaths = snap.docs.map((d) => `/${d.id}`);
        } catch (e) {
          // fallback to common city pages if Firestore not available
          seoPaths = ["/kakinada", "/rajahmundry", "/hyderabad", "/vijayawada", "/visakhapatnam"];
        }

        const paths = [...new Set([...staticPaths, ...seoPaths])];
        const urls = paths
          .map((p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`)
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
