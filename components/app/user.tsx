'use client';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

export default function User() {
    const [profileData,setProfileData] = useState<{username:string,email:string} | null>(null);
    const router = useRouter();
    useEffect(() => {
        const user = api.get('/auth/users/me/');
        user.then((res) => {
            const userJson = res.data;
            setProfileData(userJson);
        })
    }, []);
    if(!profileData){
        return null;
    }
    const logout = async () => {
        try{
            await api.post('/auth/token/logout/',{});
            setCookie('token','',{
                maxAge:0,
            })
            router.push('/auth/signin');
            toast.success('Logged out successfully');
        }catch(error){
            if(axios.isAxiosError(error)){
                const serverError = error.response?.data;
                if(serverError?.detail){
                    toast.error(serverError.detail);
                    return;
                }
            }
            if(error instanceof Error){
                toast.error(error.message);
                return;
            }
        }
    }
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button variant="ghost">{profileData.username}</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-fit">
            <Button variant="ghost" onClick={logout}>Logout</Button>
            </HoverCardContent>
        </HoverCard>
    );
}