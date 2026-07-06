"use client"

import { useEffect } from "react";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useHydration } from "@/hooks/useHydration";

export function AuthGuard({ children }: {children: React.ReactNode }) {
    const router = useRouter();
    const hydrated = useHydration();
    const user = useAuthStore((s) => s.user);
    const token = useAuthStore((s) => s.token);

    useEffect(() => {
        if (!hydrated) return;

        if (!token || !user) {
            router.replace("/login");
            return;
        }

        if (user.role !== "kasir") {
            useAuthStore.getState().logout();
            router.replace("/login")
        }
    }, [hydrated, token, user, router]);

    if (!hydrated || !token || !user || user.role !== "kasir") {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spintext-muted-foreground"/>
            </div>
        );
    }

    return <>{children}</>;
}