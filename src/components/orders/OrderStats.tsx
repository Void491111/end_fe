"use client";

import { useMemo } from "react";
import { ShoppingBag, DollarSign, Clock, XCircle } from "lucide-react";
import { useOrderStore } from "@/store/useOrderStatus";
import { formatCurrency } from "@/lib/format";

export function OrderStats() {
  const allOrders = useOrderStore((s) => s.orders);

  const todayOrders = useMemo(() => {
    const today = new Date().toDateString();
    return allOrders.filter(
      (o) => new Date(o.createdAt).toDateString() === today
    );
  }, [allOrders]);

  const completedOrders = useMemo(
    () => todayOrders.filter((o) => o.status === "completed"),
    [todayOrders]
  );

  const voidedOrders = useMemo(
    () => todayOrders.filter((o) => o.status === "voided"),
    [todayOrders]
  );

  const totalRevenue = useMemo(
    () => completedOrders.reduce((sum, o) => sum + o.total, 0),
    [completedOrders]
  );

  const totalVoided = useMemo(
    () => voidedOrders.reduce((sum, o) => sum + o.total, 0),
    [voidedOrders]
  );

  const avgOrderValue =
    completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  const stats = [
    {
      label: "Total Orders",
      value: completedOrders.length.toString(),
      icon: ShoppingBag,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Avg Order",
      value: formatCurrency(avgOrderValue),
      icon: Clock,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-3">
      {/* Row 1: Main stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}
                >
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold truncate">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2: Voided summary */}
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
            <XCircle className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Total Voided</p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <p className="text-lg font-bold text-destructive">
                {voidedOrders.length} order
              </p>
              <span className="text-muted-foreground text-sm">•</span>
              <p className="text-lg font-bold text-destructive truncate">
                {formatCurrency(totalVoided)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}