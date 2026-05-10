import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

export function Logo ({className, size = "md" }: LogoProps) {
    const sizes = {
        sm: { box: "h-8 w-8 text-sm", text: "text-base" },
        md: { box: "h-10 w-10 text-base", text: "text-lg" },
        lg: { box: "h-14 w-14 text-xl", text: "text-2xl" },
    };

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div
                className={cn(
                    "flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-sm",
                    sizes[size].box
                )}
            >
                M
            </div>
            <span className={cn("font-semibold tracking-tight", sizes[size].text)}>
                {APP_NAME}
            </span>
        </div>
    );
}