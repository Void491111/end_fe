import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/shared/PageTransition";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { CashierSplashHost } from "@/components/splash/CashierSplashHost";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <CashierSplashHost />
      <div className="flex h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 overflow-auto">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </AuthGuard>
  );
}