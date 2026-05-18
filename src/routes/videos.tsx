import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./about";
import { useVideos } from "@/hooks/use-cms";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Videos — SS Packers & Movers" },
      { name: "description", content: "Watch how SS Packers & Movers handles your relocation." },
    ],
  }),
  component: VideosPage,
});

function getYoutubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return m?.[1];
}

function VideosPage() {
  const { data: videos = [], isLoading } = useVideos();

  return (
    <SiteLayout>
      <PageHero eyebrow="Videos" title="See us in action" />
      <section className="container mx-auto px-4 py-16">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : videos.length === 0 ? (
          <p className="text-center text-muted-foreground">No videos yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => {
              const id = getYoutubeId(v.video_url);
              return (
                <div key={v.id} className="rounded-2xl overflow-hidden border border-border bg-card">
                  <div className="aspect-video bg-black">
                    {id && (
                      <iframe
                        className="h-full w-full"
                        src={`https://www.youtube.com/embed/${id}`}
                        title={v.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="font-semibold">{v.title}</div>
                    {v.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{v.description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
