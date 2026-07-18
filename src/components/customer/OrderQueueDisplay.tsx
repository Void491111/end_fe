"use client";

interface Props {
  queueNumber: string;
  customerName: string;
}

export function OrderQueueDisplay({ queueNumber, customerName }: Props) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 text-center">
      <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
        Nomor Antrian
      </p>
      <p className="text-6xl font-black text-primary mt-2 tracking-tight tabular-nums">
        {queueNumber}
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Atas nama <span className="font-semibold text-foreground">{customerName}</span>
      </p>
    </section>
  );
}
