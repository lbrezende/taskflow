import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";
import { TrialBanner } from "@/components/layout/trial-banner";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white font-['Inter',sans-serif]">
      <TrialBanner />
      <TopHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-white">{children}</main>
      </div>
    </div>
  );
}
