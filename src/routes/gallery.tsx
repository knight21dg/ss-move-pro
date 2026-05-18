import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./about";
import { useGallery } from "@/hooks/use-cms";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — SS Packers & Movers" },
      { name: "description", content: "Photos from our packing, moving, warehousing and vehicle transport operations." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { data: items = [], isLoading } = useGallery();

  return (
    <SiteLayout>
      <PageHero eyebrow="Gallery" title="A look at our work" subtitle="Real moments from real moves we've handled across India." />
      <section className="container mx-auto px-4 py-16">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground">No gallery images yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it) => (
              <div key={it.id} className="relative group overflow-hidden rounded-2xl aspect-[4/3]">
                <img src={it.image_url} alt={it.title ?? ""} loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                {(it.title || it.category) && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      {it.title && <div className="font-semibold">{it.title}</div>}
                      {it.category && <div className="text-xs text-white/80">{it.category}</div>}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
