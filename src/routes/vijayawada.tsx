import { createFileRoute } from "@tanstack/react-router";
import { CityPage } from "@/components/site/CityPageLayout";
import { citiesQueryOptions } from "@/hooks/use-cms";

export const Route = createFileRoute("/vijayawada")({
  loader: async ({ context }: any) => {
    try { await context.queryClient.ensureQueryData(citiesQueryOptions(true)); } catch (e) { console.error(e); }
  },
  component: () => <CityPage slug="vijayawada" />,
});
