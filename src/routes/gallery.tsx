import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./about";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — SS Packers & Movers" },
      { name: "description", content: "Photos from our packing, moving, warehousing and vehicle transport operations." },
    ],
  }),
  component: GalleryPage,
});

const items = [
  { src: g1, label: "Household Packing" },
  { src: g2, label: "Car Transport" },
  { src: g3, label: "Warehouse Storage" },
  { src: g4, label: "Office Relocation" },
  { src: g1, label: "Furniture Packing" },
  { src: g3, label: "Inventory Handling" },
];

function GalleryPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Gallery" title="A look at our work" subtitle="Real moments from real moves we've handled across India." />
      <section className="container mx-auto px-4 py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it, i) => (
          <div key={i} className="relative group overflow-hidden rounded-2xl aspect-[4/3]">
            <img src={it.src} alt={it.label} loading="lazy" width={1024} height={768} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white font-semibold">{it.label}</div>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
