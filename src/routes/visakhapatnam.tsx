import { createFileRoute } from "@tanstack/react-router";
import { CityPage } from "@/components/site/CityPageLayout";
import { citiesQueryOptions, settingsQueryOptions, getSeoForPage } from "@/hooks/use-cms";

export const Route = createFileRoute("/visakhapatnam")({
  loader: async ({ context }: any) => {
    try {
      const [settings, cities] = await Promise.all([
        context.queryClient.ensureQueryData(settingsQueryOptions()),
        context.queryClient.ensureQueryData(citiesQueryOptions(true)),
      ]);
      const city = cities.find((c: any) => c.slug === "visakhapatnam");
      const seo = getSeoForPage(settings, "services");
      return {
        title: city?.meta_title || city?.name || "Visakhapatnam",
        description: city?.meta_description || city?.hero_subtitle || seo.description,
        og_image: city?.hero_image || seo.og_image,
      };
    } catch (e) {
      console.error(e);
      return { title: "Visakhapatnam", description: "", og_image: "" };
    }
  },
  head: ({ loaderData }: any) => ({
    meta: [
      { title: `${loaderData?.title} | SS Packers & Movers` },
      { name: "description", content: loaderData?.description || "" },
      { property: "og:title", content: `${loaderData?.title} | SS Packers & Movers` },
      { property: "og:description", content: loaderData?.description || "" },
      ...(loaderData?.og_image
        ? [
            { property: "og:image", content: loaderData.og_image },
            { name: "twitter:image", content: loaderData.og_image },
          ]
        : []),
    ],
  }),
  component: () => <CityPage slug="visakhapatnam" />,
});
