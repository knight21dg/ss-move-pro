export function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-6xl font-black text-gray-200 dark:text-gray-700 md:text-8xl">
          404
        </h1>
        <p className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
          Page Not Found
        </p>
        <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
          The page you are looking for does not exist.
        </p>
        <a
          href="/"
          className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
