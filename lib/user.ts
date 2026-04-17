import {cookies} from "next/headers";
import { getCookie } from "cookies-next";
import { cache } from "react";
export const getUser = cache(async () => {
    const token = await getCookie("token",{ cookies });
    if(!token){
        return 'the user is not logged in';
    }
    const user = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/me/`,{
        headers:{
            Authorization:`Token ${token}`
        }
    });
    if(!user.ok){
        return 'the user is not logged in'
    }
    const userJson = await user.json();
    const profile = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${userJson.username}/`,{
        headers:{
            Authorization:`Token ${token}`
        }
    });
    const profileData = await profile.json();
    return profileData;
})