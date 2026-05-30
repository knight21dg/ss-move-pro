import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Target, Users, Truck, Phone } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { useSettings, settingsQueryOptions } from "@/hooks/use-cms";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SS Packers & Movers Kakinada" },
      {
        name: "description",
        content:
          "Learn about SS Packers & Movers — Kakinada's trusted relocation company serving households and businesses across India.",
      },
      { property: "og:title", content: "About SS Packers & Movers Kakinada" },
      { property: "og:description", content: "Trusted relocation company from Kakinada." },
    ],
  }),
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(settingsQueryOptions());
    } catch (error) {
      console.error("Error prefetching data for about route:", error);
    }
  },
  component: AboutPage,
});

function AboutPage() {
  const { data: s } = useSettings();
  const about = s?.about;
  const contact = s?.contact;
  const heroImage = s?.hero_images?.about;
  const phone = contact?.phone;
  const phoneHref = phone ? `tel:${phone.replace(/\s/g, "")}` : "";

  return (
    <SiteLayout>
      <PageHero
        eyebrow="About Us"
        title={about?.heading || ""}
        subtitle={about?.hero_subtitle || ""}
        backgroundImage={heroImage}
      />

      {/* MISSION & STORY */}
      {about?.body && (
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
              {about.body}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild variant="brand" size="lg" style={s?.cta?.cta_bg_color ? { backgroundColor: s.cta.cta_bg_color } : undefined}>
                <Link to="/enquiry" search={{ service: undefined }}>Get Free Quote</Link>
              </Button>
              {phone && (
                <Button asChild variant="outline" size="lg" style={s?.cta?.call_bg_color ? { backgroundColor: s.cta.call_bg_color, borderColor: s.cta.call_bg_color } : undefined}>
                  <a href={phoneHref}><Phone /> Call Now</a>
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* TEAM */}
      {about?.team_show && about?.team_members?.length > 0 && (
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            {about.team_eyebrow && (
              <div className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
                {about.team_eyebrow}
              </div>
            )}
            {about.team_title && (
              <h2 className="text-3xl md:text-4xl font-extrabold text-balance">{about.team_title}</h2>
            )}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {about.team_members.map((member) => (
              <div key={member.id} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-4 mb-4">
                  {member.image_url ? (
                    <img
                      src={optimizeCloudinaryUrl(member.image_url, 80, 80)}
                      alt={member.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gradient-brand text-white flex items-center justify-center text-xl font-bold">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-lg">{member.name}</div>
                    {member.role && <div className="text-sm text-primary font-medium">{member.role}</div>}
                  </div>
                </div>
                {member.bio && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{member.bio}</p>
                )}
                {member.vehicles && (
                  <div className="flex flex-wrap gap-2">
                    {member.vehicles.split(",").map((v) => (
                      <span key={v.trim()} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs px-3 py-1">
                        <Truck className="h-3 w-3" /> {v.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Commitments / Values section */}
      {(about?.commitment_eyebrow || about?.commitment_title) && (
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              {about.commitment_eyebrow && (
                <div className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
                  {about.commitment_eyebrow}
                </div>
              )}
              {about.commitment_title && (
                <h2 className="text-3xl md:text-4xl font-extrabold">{about.commitment_title}</h2>
              )}
              {about.commitment_description && (
                <p className="mt-3 text-muted-foreground">{about.commitment_description}</p>
              )}
            </div>
            <div className="grid gap-6 mt-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl bg-card border border-border p-6 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-primary mb-3" />
                <div className="font-semibold">Care-first Packing</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Quality materials and careful handling for fragile items.
                </div>
              </div>
              <div className="rounded-2xl bg-card border border-border p-6 text-center">
                <Users className="mx-auto h-8 w-8 text-primary mb-3" />
                <div className="font-semibold">Trained Crew</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Background-checked teams trained in efficient loading and placement.
                </div>
              </div>
              <div className="rounded-2xl bg-card border border-border p-6 text-center">
                <Target className="mx-auto h-8 w-8 text-primary mb-3" />
                <div className="font-semibold">Transparent Pricing</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Itemised estimates and no-hidden-fees policy for every move.
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  backgroundImage,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}) {
  const hasImage = Boolean(backgroundImage);
  const optimizedImage = backgroundImage ? optimizeCloudinaryUrl(backgroundImage, 1200) : undefined;
  return (
    <section
      className={hasImage ? "relative overflow-hidden text-white" : "bg-gradient-dark text-white"}
    >
      {hasImage && (
        <div className="absolute inset-0">
          <img src={optimizedImage} alt={title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>
      )}
      <div className="relative container mx-auto px-4 py-20 md:py-28 text-center max-w-3xl">
        <div className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
          {eyebrow}
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-balance">{title}</h1>
        {subtitle && <p className="mt-5 text-white/80 text-lg">{subtitle}</p>}
      </div>
    </section>
  );
}
