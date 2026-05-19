import { TruckLoader } from "./TruckLoader";

interface PageLoaderProps {
  message?: string;
}

/**
 * PageLoader
 *
 * Full-viewport loading overlay, theme-aware (uses `--foreground` / `--brand`).
 * Drop it into any route as the pending-state return value.
 *
 * ```tsx
 * // inside a TanStack Router or Suspense route
 * if (isLoading) return <PageLoader />;
 * ```
 */
export function PageLoader({ message = "Loading..." }: PageLoaderProps = {}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
      <TruckLoader size={56} />
      <p className="text-sm text-muted-foreground tracking-wide">{message}</p>
    </div>
  );
}
