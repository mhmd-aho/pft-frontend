'use client'
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Button } from "../ui/button";
import { useProfile } from "@/context/Profile";
import { Skeleton } from "../ui/skeleton";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function User() {
    const router = useRouter();
    const {profile,loading,logout} = useProfile();
    if(loading){
        return(
            <Skeleton className="w-32 h-5" />
        )
    }
    if(!profile){
        return null;
    }
    const handleLogout = async () => {
        try{
            await api.post('/auth/token/logout/');
            logout();
            toast.success('Logged out successfully');
            router.push('/auth/signin');
        }catch{
            toast.error('Failed to logout');
        }
    }
    return (
        <HoverCard>
            <HoverCardTrigger>
                <p>{profile.user.username}</p>
            </HoverCardTrigger>
            <HoverCardContent>
                <Button onClick={handleLogout}>Logout</Button>
            </HoverCardContent>
        </HoverCard>
    );
}