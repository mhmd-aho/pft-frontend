import { getCookie } from "cookies-next";
import {cookies} from "next/headers";

export  async function serverFetch(endpoint:string,init?:RequestInit){
    const token = await getCookie('token',{cookies})
    if(!token){
        throw new Error('No token found');
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${cleanEndpoint}`;
    return fetch(url,{...init,headers:{...init?.headers,Authorization:`Token ${token}`}})
}