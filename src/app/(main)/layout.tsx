import { Header } from "@/components/layout/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 overflow-auto">{children}</main>
    </div>
  );
}