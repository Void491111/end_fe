"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";
import { useOrderStore } from "@/store/useOrderStore"; // Tarik data dari store order

export default function DashboardPage() {
  const orders = useOrderStore((s) => s.orders);

  // Otomatis kalkulasi ulang setiap ada order baru atau ada order yang di-void
  const chartData = useMemo(() => {
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const totals = [0, 0, 0, 0, 0, 0, 0];

    orders.forEach((order) => {
      // Hanya hitung order yang tidak di-void
      if (order.status !== "voided") {
        const date = new Date(order.createdAt);
        const dayIndex = date.getDay(); // 0 = Minggu, 1 = Senin, dst.
        totals[dayIndex] += order.total; // Tambahkan ke total pendapatan hari itu
      }
    });

    return days.map((day, index) => ({
      name: day,
      total: totals[index],
    }));
  }, [orders]);

  // Hitung total revenue keseluruhan
  const totalRevenue = chartData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="flex flex-1 flex-col p-6 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Dashboard Analitik
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Total Pendapatan: <span className="font-bold text-primary">Rp{(totalRevenue / 1000).toLocaleString('id-ID')}k</span>
        </p>
      </div>

      <div className="h-100 w-full max-w-4xl rounded-3xl border border-border bg-card p-6 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rp${val/1000}k`} />
            <Tooltip 
              cursor={{ fill: "var(--muted)" }} 
              contentStyle={{ borderRadius: "12px", border: "none", backgroundColor: "var(--card)", color: "var(--foreground)" }} 
              // PERUBAHAN DI BARIS BAWAH INI: ubah value jadi any, dan pastikan di-convert ke Number
              formatter={(value: any) => [`Rp${Number(value).toLocaleString('id-ID')}`, "Pendapatan"]}
            />
            <Bar dataKey="total" fill="currentColor" className="fill-primary" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}