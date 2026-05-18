import { Outlet } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingActions } from "./FloatingActions";
import { Toaster } from "@/components/ui/sonner";

export function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1"><Outlet /></main>
      <Footer />
      <FloatingActions />
      <Toaster />
    </div>
  );
}
