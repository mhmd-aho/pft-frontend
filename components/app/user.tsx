'use client';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {  logoutAction } from "@/app/actions";
import type { ProfileType } from "@/lib/schemas";
export default function User({profileData}: {profileData: ProfileType | null}) {
    const router = useRouter();
    if(!profileData){
        return null;
    }
    const logout = async () => {
            const logoutRes = await logoutAction();
            if(logoutRes.success){
                router.push('/auth/signin');
                toast.success('Logged out successfully');
            }
            else{
                toast.error(logoutRes.error)
            }
    }
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button variant="ghost">{profileData.user.username}</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-fit">
            <Button variant="ghost" onClick={logout}>Logout</Button>
            </HoverCardContent>
        </HoverCard>
    );
}