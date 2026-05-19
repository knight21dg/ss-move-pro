import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,       // 1 min — data stays fresh without refetch
        gcTime: 5 * 60_000,       // 5 min — unused data stays in cache
        refetchOnWindowFocus: false, // don't refetch when user returns to tab
        refetchOnReconnect: false,   // don't refetch on network reconnection
        retry: 1,                    // retry once on failure, not more
      },
      mutations: {
        retry: 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 60_000, // preloaded routes stay fresh for 1 min
  });

  return router;
};
