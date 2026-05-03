import {cookies} from "next/headers";
import { cache } from "react";
import { TransactionType } from "./schemas";
import { serverFetch } from "./server-fetch";
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
export const getMonthlyTransactions = cache(async (profileId: number)=>{
    try{
        const res = await serverFetch(`/api/transactions/profile/${profileId}/monthly/`,{
            next: { tags: ['transactions'] } 
        });
        const transactionsData = await res.json();
        const transactions:TransactionType[] = transactionsData;
        return transactions;
    }catch(e: any){
        return e.message || 'Error while fetching transactions'
    }
})