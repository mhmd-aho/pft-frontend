import {cookies} from "next/headers";
import { cache } from "react";
export const getUser = cache(async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
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
    if(!profile.ok){
        return 'the user is not logged in'
    }
    const profileData = await profile.json();
    return profileData;
})