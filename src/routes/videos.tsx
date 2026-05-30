import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./about";
import {
  useSettings,
  useVideos,
  videosQueryOptions,
  settingsQueryOptions,
  getSeoForPage,
} from "@/hooks/use-cms";

export const Route = createFileRoute("/videos")({
  loader: async ({ context }) => {
    try {
      const [settings] = await Promise.all([
        context.queryClient.ensureQueryData(settingsQueryOptions()),
        context.queryClient.ensureQueryData(videosQueryOptions(true)),
      ]);
      return { seo: getSeoForPage(settings, "videos") };
    } catch (error) {
      console.error("Error prefetching data for videos route:", error);
      return { seo: null };
    }
  },
  head: ({ loaderData }: any) => {
    const seo = loaderData?.seo;
    const title = seo?.title || "Videos — SS Packers & Movers";
    const desc = seo?.description || "Watch how SS Packers & Movers handles your relocation.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(seo?.og_image ? [
          { property: "og:image", content: seo.og_image },
          { name: "twitter:image", content: seo.og_image },
        ] : []),
      ],
    };
  },
  component: VideosPage,
});

function getYoutubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return m?.[1];
}

function VideosPage() {
  const { data: videos = [] } = useVideos();
  const { data: s } = useSettings();
  const heroImage = s?.hero_images?.videos;
  return (
    <SiteLayout>
      <PageHero eyebrow="Videos" title="See us in action" backgroundImage={heroImage} />
      <section className="container mx-auto px-4 py-16 md:py-20">
        {videos.length === 0 ? (
          <p className="text-center text-muted-foreground">No videos yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {videos.map((v) => {
              const id = getYoutubeId(v.video_url);
              return (
                <div
                  key={v.id}
                  className="rounded-2xl overflow-hidden border border-border bg-card"
                >
                  <div className="aspect-video bg-black">
                    {id && (
                      <a
                        className="h-full w-full block"
                        onClick={(e) => {
                          e.preventDefault();
                          import("@/components/site/Lightbox").then((m) =>
                            m.openLightbox({
                              type: "video",
                              src: `https://www.youtube.com/embed/${id}`,
                              title: v.title,
                            }),
                          );
                        }}
                      >
                        <img
                          src={v.thumbnail_url || `https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                          alt={v.title}
                          className="h-full w-full object-cover"
                        />
                      </a>
                    )}
                  </div>
                  <div className="p-4 md:p-5">
                    <div className="font-semibold">{v.title}</div>
                    {v.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {v.description}
                      </p>
                    )}
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
