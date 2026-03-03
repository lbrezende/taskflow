import { Navbar } from "@/components/layout/navbar";
import { TrialBanner } from "@/components/layout/trial-banner";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TrialBanner />
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
