"use client";

interface Props {
  createdAt: string;
  paidAt: string | null;
  tableName?: string;
  tableCode?: string;
}

export function OrderMetaInfo({ createdAt, paidAt, tableName, tableCode }: Props) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 space-y-2">
      <MetaRow label="Waktu Pesan" value={formatTime(createdAt)} />
      {paidAt && <MetaRow label="Waktu Bayar" value={formatTime(paidAt)} />}
      {tableName && tableCode && (
        <MetaRow label="Meja" value={`${tableName} (${tableCode})`} />
      )}
    </section>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
