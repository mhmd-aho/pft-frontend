import ThemeToggle from "./theme-toggle";
import User from "./user";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import Link from "next/link";
import { getUser } from "@/lib/user";
import type { ProfileType } from "@/lib/schemas";
export default async function Header() {
    const profileData:ProfileType | null = await getUser();

    return (
        <header className="w-full h-12 px-4 flex items-center justify-between">
            <Link href="/dashboard">
                <span className="text-2xl font-syne tracking-[-0.04em]">fin<span className="text-primary">flow</span></span>
            </Link>
            <div className="flex items-center gap-2">
                <Suspense fallback={<Skeleton className="w-30 h-5" />}>
                    <User profileData={profileData} />
                </Suspense>
                <ThemeToggle />
            </div>
        </header>
    );
}