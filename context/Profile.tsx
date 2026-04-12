'use client'
import { createContext, useContext, useState, useEffect } from "react";
import type { ProfileType } from "@/lib/schemas";
import api from "@/lib/api";
import { getCookie, setCookie } from "cookies-next";
interface ProfileContextType {
    profile: ProfileType | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
    logout: () => void;
}
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({children}: {children: React.ReactNode}) => {
    const [profile,setProfile] = useState<ProfileType | null>(null);
    const [loading,setLoading] = useState<boolean>(true);
    const fetchProfile = async () => {
       try{
        const response = await api.get("/auth/users/me/");
        const user = response.data;
        const profileResponse = await api.get(`/api/profiles/${user.username}/`);
        setProfile(profileResponse.data);
       }catch{
        setProfile(null);
       }finally{
        setLoading(false);
       }
    }
    useEffect(() => {
        const token = getCookie("token");
        if(token){
            fetchProfile();
        }else{
            setLoading(false);
        }
    },[]);
    const logout = () => {
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