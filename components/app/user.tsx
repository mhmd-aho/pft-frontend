'use client';
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {  logoutAction } from "@/app/actions";
import type { ProfileType } from "@/lib/schemas";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
export default function User({profileData}: {profileData: ProfileType | null}) {
    const [isPending,startTransition] = useTransition();
    const router = useRouter();
    if(!profileData || !profileData.user){
        return null;
    }
    const logout = async () => {
        startTransition(async() => {
            const logoutRes = await logoutAction();
            if(logoutRes.success){
                router.push('/');
                toast.success('Logged out successfully');
            }
            else{
                toast.error(logoutRes.error)
            }
        })
    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost">{profileData.user.username}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
            <Button variant="ghost" onClick={logout}>{isPending ? <>Signing Out <Loader2 className="size-4 animate-spin ml-2" /></>:'Sign Out'}</Button>
            </PopoverContent>
        </Popover>
    );
}