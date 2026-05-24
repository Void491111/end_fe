"use client";

import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ClearCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemCount: number;
  onConfirm: () => void;
}

export function ClearCartDialog({
  open,
  onOpenChange,
  itemCount,
  onConfirm,
}: ClearCartDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Hapus semua pesanan?</DialogTitle>
          </div>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          {itemCount} item akan dihapus dari cart. Aksi ini tidak bisa
          dibatalkan.
        </p>

        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button variant="destructive" className="flex-1" onClick={onConfirm}>
            Ya, Hapus
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}