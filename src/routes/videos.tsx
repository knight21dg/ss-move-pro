import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./about";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Videos — SS Packers & Movers" },
      { name: "description", content: "Watch how SS Packers & Movers handles your relocation." },
    ],
  }),
  component: VideosPage,
});

const videos = [
  { id: "ScMzIvxBSi4", title: "How we pack your home" },
  { id: "aqz-KE-bpKQ", title: "Car transport process" },
  { id: "9bZkp7q19f0", title: "Inside our warehouse" },
];

function VideosPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Videos" title="See us in action" />
      <section className="container mx-auto px-4 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((v) => (
          <div key={v.id} className="rounded-2xl overflow-hidden border border-border bg-card">
            <div className="aspect-video bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${v.id}`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-5 font-semibold">{v.title}</div>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
