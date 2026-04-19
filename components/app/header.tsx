import ThemeToggle from "./theme-toggle";
import User from "./user";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import Link from "next/link";
export default function Header() {
    return (
        <header className="w-full h-12 px-4 flex items-center justify-between">
            <Link href="/dashboard">
                <span className="text-2xl font-syne tracking-[-0.04em]">fin<span className="text-primary">flow</span></span>
            </Link>
            <div className="flex items-center gap-2">
                <Suspense fallback={<Skeleton className="w-30 h-5" />}>
                    <User />
                </Suspense>
                <ThemeToggle />
            </div>
        </header>
    );
}