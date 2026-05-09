import { CategorySidebar } from "@/components/pos/CategorySidebar";
import { MenuGrid } from "@/components/pos/MenuGrid";
import { CartPanel } from "@/components/pos/CartPanel";

export default function POSPage() {
  return (
    <>
      <CategorySidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <MenuGrid />
      </div>
      <CartPanel />
    </>
  );
}