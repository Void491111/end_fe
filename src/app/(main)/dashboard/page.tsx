"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";

// Data dummy untuk contoh grafik
const data = [
  { name: "Sen", total: 1500000 },
  { name: "Sel", total: 2300000 },
  { name: "Rab", total: 1800000 },
  { name: "Kam", total: 2900000 },
  { name: "Jum", total: 3500000 },
  { name: "Sab", total: 4200000 },
  { name: "Min", total: 3800000 },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col p-6 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Dashboard Analitik
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Ringkasan pendapatan 7 hari terakhir</p>
      </div>

      <div className="h-100 w-full max-w-4xl rounded-3xl border border-border bg-card p-6 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rp${val/1000}k`} />
            <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ borderRadius: "12px", border: "none", backgroundColor: "var(--card)" }} />
            <Bar dataKey="total" fill="currentColor" className="fill-primary" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}