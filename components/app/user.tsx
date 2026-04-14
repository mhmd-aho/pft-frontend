'use client'
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Button } from "../ui/button";
import { useProfile } from "@/context/Profile";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

export default function User() {
    const router = useRouter();
    const {profile,loading,logout} = useProfile();
    const [isPending,startTransition] = useTransition();
    if(loading){
        return(
            <Skeleton className="w-20 h-5" />
        )
    }
    if(!profile){
        return null;
    }
    const handleLogout = async () => {
        startTransition(async () => {
        try{
            await logout();
            toast.success('Logged out successfully');
            router.push('/auth/signin');
        }catch{
            toast.error('Failed to logout');
        }
    })
    }
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button variant="ghost">{profile.user.username}</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-fit">
            <Button disabled={isPending} onClick={handleLogout}>{isPending ?<span><Loader2 className="size-5 animate-spin" /> Logging out</span> : "Logout"}</Button>
            </HoverCardContent>
        </HoverCard>
    );
}