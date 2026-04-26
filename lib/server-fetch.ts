import {cookies} from "next/headers";

export class ApiError extends Error {
    status: number;
    data: any;

    constructor(status: number, data: any) {
        let message = 'Something went wrong';
        if (typeof data === 'string') {
            message = data;
        } else if (data?.detail) {
            message = data.detail;
        } else if (data?.non_field_errors?.[0] && Array.isArray(data.non_field_errors)) {
            message = data.non_field_errors[0];
        } else if (typeof data === 'object' && data !== null) {
            const firstKey = Object.keys(data)[0];
            const firstError = data[firstKey];
            if (Array.isArray(firstError)) {
                message = firstError[0];
            } else if (typeof firstError === 'string') {
                message = firstError;
            }
        }
        
        super(message);
        this.status = status;
        this.data = data;
        this.name = 'ApiError';
    }
}

export async function serverFetch(endpoint:string,init?:RequestInit){
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if(!token){
        throw new Error('No token found');
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${cleanEndpoint}`;
    const res = await fetch(url,{...init,headers:{...init?.headers,Authorization:`Token ${token}`}});
    
    if (!res.ok) {
        const isJson = res.headers.get('content-type')?.includes('application/json');
        const data = isJson ? await res.json() : await res.text();
        throw new ApiError(res.status, data);
    }
    
    return res;
}