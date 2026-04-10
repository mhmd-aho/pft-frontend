'use client'
import { useEffect, useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import api from "@/lib/api";
import { Button } from "../ui/button";
import { toast } from "sonner";

export default function User() {
    const [user,setUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try{
                const response = await api.get("/auth/users/me/");
                setUser(response.data);
            }catch(error){
                console.log(error);
            }
        }
        fetchUser();
    }, []);
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