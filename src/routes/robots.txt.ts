import { createFileRoute } from "@tanstack/react-router";

const BASE_URL = import.meta.env.VITE_SITE_URL || "";

export const Route = createFileRoute("/robots/txt")({
  server: {
    handlers: {
      GET: async () => {
        const txt = `User-agent: *\nDisallow: /admin\nSitemap: ${BASE_URL}/sitemap.xml\n`;
        return new Response(txt, {
          headers: { "Content-Type": "text/plain", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
