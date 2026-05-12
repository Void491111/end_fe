"use client" ;

import { useSyncExternalStore } from "react";

export function useHydration(): boolean {
    return useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );
}