import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./about";
import { doc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import type { Service } from "@/hooks/use-cms";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const slug = params.slug as string;
    const q = query(collection(db, "services"), where("slug", "==", slug));
    const snap = await getDocs(q);
    const docRef = snap.docs[0];
    if (!docRef) return null;
    const data = { id: docRef.id, ...(docRef.data() as any) } as Service;
    return { service: data } as any;
  },
  head: ({ loaderData }: any) => {
    const svc = loaderData?.service;
    const title = svc ? `${svc.title} | SS Packers & Movers` : "Service";
    const desc = svc?.description
      ? svc.description.slice(0, 150)
      : "Professional packing and moving services.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    } as any;
  },
  component: ServicePage as any,
});

function ServicePage({ loaderData }: any) {
  const svc: Service | null = loaderData?.service ?? null;
  if (!svc)
    return (
      <SiteLayout>
        <section className="container mx-auto px-4 py-20 text-center">Service not found.</section>
      </SiteLayout>
    );

  const ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: svc.title,
    description: svc.description,
    provider: { "@type": "LocalBusiness", name: "SS Packers & Movers Mini Transport" },
  };

  return (
    <SiteLayout>
      <script type="application/ld+json">{JSON.stringify(ld)}</script>
      <PageHero
        eyebrow="Service"
        title={svc.title}
        subtitle={svc.description}
        backgroundImage={svc.image_url}
      />
      <section className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        {svc.image_url && (
          <img
            src={optimizeCloudinaryUrl(svc.image_url, 800)}
            alt={svc.title}
            className="rounded-xl mb-6 w-full max-w-2xl"
          />
        )}
        <div
          className="prose max-w-none text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: svc.description }}
        />
        <div className="mt-8">
          <Link to="/enquiry" search={{ service: svc.title }} className="text-primary font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">
            Enquire about this service
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
