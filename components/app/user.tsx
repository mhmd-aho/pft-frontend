'use client'
import { useEffect, useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import api from "@/lib/api";
import { Button } from "../ui/button";
import { toast } from "sonner";
import type { UserType } from "@/lib/schemas";

export default function User() {
    const [user,setUser] = useState<UserType | null>(null);
    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try{
    //             const response = await api.get("/auth/users/me/");
    //             setUser(response.data);
    //         }catch(error){
    //             console.log(error);
    //         }
    //     }
    //     fetchUser();
    // }, []);
    const handleLogout = async() => {
        try{
            await api.post('/auth/token/logout/');
            localStorage.removeItem("token");
            toast.success("Logged out successfully");
        }catch(error){
            console.log(error);
            toast.error('Failed to logout');
        }
    }
    return (
        <HoverCard>
            <HoverCardTrigger>
                <p>{user?.username}</p>
            </HoverCardTrigger>
            <HoverCardContent>
                <Button onClick={handleLogout}>Logout</Button>
            </HoverCardContent>
        </HoverCard>
    );
}