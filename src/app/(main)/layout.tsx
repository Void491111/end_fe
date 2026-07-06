import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/shared/PageTransition";
import { AuthGuard } from "@/components/auth/authGuard";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 overflow-auto">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </AuthGuard>
  );
}