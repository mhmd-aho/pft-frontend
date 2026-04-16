import {cookies} from "next/headers";
import { getCookie } from "cookies-next";
import { cache } from "react";
export const getUser = cache(async () => {
    const token = await getCookie("token",{ cookies });
    if(!token){
        return null;
    }
    const user = await fetch("http://127.0.0.1:8000/auth/users/me/",{
        headers:{
            Authorization:`Token ${token}`
        }
    });
    const userJson = await user.json();
    const profile = await fetch(`http://127.0.0.1:8000/api/profiles/${userJson.username}/`,{
        headers:{
            Authorization:`Token ${token}`
        }
    });
    const profileData = await profile.json();
    return {profileData , token};
})