import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingActions } from "./FloatingActions";
import { Toaster } from "@/components/ui/sonner";
import { DynamicSeo } from "@/components/site/DynamicSeo";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <DynamicSeo />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingActions />
      <Toaster />
    </div>
  );
}
