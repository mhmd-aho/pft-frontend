'use client'
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { getCookie, setCookie } from "cookies-next";
import { toast } from "sonner";
type UserType = {
    username: string;
    email: string;
}
type ProfileType = {
    id: number;
    user: UserType;
    balance: number;
}
interface ProfileContextType {
    profile: ProfileType | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
    logout: () => Promise<void>;
}
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({children}: {children: React.ReactNode}) => {
    const [profile,setProfile] = useState<ProfileType | null>(null);
    const [loading,setLoading] = useState<boolean>(true);
    const fetchProfile = useCallback(async () => {
       try{
        const response = await api.get("/auth/users/me/");
        const user = response.data;
        const profileResponse = await api.get(`/api/profiles/${user.username}/`);
        setProfile(profileResponse.data);
       }catch(error){
        const e = error as any;
        const message = e?.response?.data?.detail ?? "Failed to fetch profile";
        setProfile(null);
        toast.error(message);

       }finally{
        setLoading(false);
       }
    },[])
    useEffect(() => {
        const token = getCookie("token");
        if(token){
            fetchProfile();
        }else{
            setLoading(false);
        }
    },[fetchProfile]);
    const logout = async () => {
        try{
            await api.post("/auth/token/logout/");
            toast.success("Logged out successfully");
        }catch(error){
            const message = error?.response?.data?.detail || error?.response?.data?.message ||"Failed to logout";
            toast.error(message);
        }
        setCookie("token", "", {
            maxAge: 0,
            path: "/",
        });
        setProfile(null);
    }
    return (
        <ProfileContext.Provider value={{profile,loading,refreshProfile:fetchProfile,logout}}>
            {children}
        </ProfileContext.Provider>
    );
}

export const useProfile = () =>{
    const context = useContext(ProfileContext);
    if(!context){
        throw new Error("useProfile must be used within ProfileProvider");
    }
    return context;
} 