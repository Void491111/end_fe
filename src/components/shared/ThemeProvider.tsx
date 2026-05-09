"use client"

import { ThemeProvider as NextThemesProvdier } from "next-themes";
import { ComponentProps } from "react";

export function ThemeProvider({
    children,
    ...props 
}: ComponentProps<typeof NextThemesProvdier>) {
    return <NextThemesProvdier {...props}>{children}</NextThemesProvdier>
}