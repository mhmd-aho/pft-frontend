'use client';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getProfile, logoutAction } from "@/app/actions";
import type { ProfileType } from "@/lib/schemas";
export default function User() {
    const [profileData,setProfileData] = useState<ProfileType | null>(null);
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            const profileRes = await getProfile();
            if(profileRes.success){
                setProfileData(profileRes.data);
            }
            else{
                toast.error(profileRes.error)
            }
        }
        fetchData();
    }, []);
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