import {cookies} from "next/headers";

export  async function serverFetch(endpoint:string,init?:RequestInit){
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if(!token){
        throw new Error('No token found');
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${cleanEndpoint}`;
    return fetch(url,{...init,headers:{...init?.headers,Authorization:`Token ${token}`}})
}