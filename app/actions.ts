'use server'
import {z} from "zod";
import { revalidateTag } from "next/cache";
import {transactionSchema} from "@/lib/schemas";
import { serverFetch } from "@/lib/server-fetch";
import { signinSchema, registerSchema } from "@/lib/schemas";
import { cookies } from "next/headers";
export async function postTransaction(data:z.infer<typeof transactionSchema>, profile_id: number) {
    try{
        const res = await serverFetch(`/api/transactions/${profile_id}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({...data, profile_id})
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw errorData;
        }

        revalidateTag('transactions');
        return { success: true };
    }catch(error: any){
        if(error?.detail){
            return {error: error.detail}
        }
        if(error?.amount){
            return {error: error.amount[0]}
        }
        if(error?.type){
            return {error: error.type[0]}
        }
        if(error?.category_id){
            return {error: error.category_id[0]}
        }
        return {error: 'Something went wrong'}
    }
}
export async function deleteTransaction(transaction_id: number) {
    try{
        const res = await serverFetch(`/api/transactions/${transaction_id}/`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw errorData;
        }

        revalidateTag('transactions');
        return { success: true };
    }catch(error: any){
        if(error?.detail){
            return {error: error.detail}
        }
        return {error: 'Something went wrong'}
    }
}
export async function signinAction(data:z.infer<typeof signinSchema>){
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw errorData;
        }

        const resData = await res.json();
        const token = resData.auth_token;
        
        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return { success: true };
    }catch(error: any){
        if(error?.non_field_errors) return {error: error.non_field_errors[0]}
        if(error?.username) return {error: error.username[0]}
        if(error?.password) return {error: error.password[0]}
        if(error?.detail) return {error: error.detail}
        return {error: 'Something went wrong'}
    }
}
export async function signupAction(data:z.infer<typeof registerSchema>){
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            throw errorData;
        }

        const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: data.username, password: data.password})
        });

        if (!loginRes.ok) {
            const errorData = await loginRes.json();
            throw errorData;
        }

        const resData = await loginRes.json();
        const token = resData.auth_token;
        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return { success: true };
    }catch(error: any){
        if(error?.non_field_errors) return {success: false, error: error.non_field_errors[0]}
        if(error?.username) return {success: false, error: error.username[0]}
        if(error?.password) return {success: false, error: error.password[0]}
        if(error?.detail) return {success: false, error: error.detail}
        return { error: 'Something went wrong'}
    }
}
export async function logoutAction(){
    try{
        const res = await serverFetch(`/auth/token/logout/`, {
            method: "POST",
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw errorData;
        }
        const cookieStore = await cookies();
        cookieStore.set("token", "", {
            maxAge: 0,
            path: "/",
        });
        return { success: true };
    }catch(error: any){
        if(error?.detail){
            return {error: error.detail}
        }
        return {error: 'Something went wrong'}
    }
}
export async function getCategories(){
    try{
        const res = await serverFetch(`/api/categories/`);
        if (!res.ok) {
            const errorData = await res.json();
            throw errorData;
        }
        const data = await res.json();
        return {success: true, data: data};
    }catch(error: any){
        if(error?.detail){
            return {success: false, error: error.detail}
        }
        return {success: false, error: 'Something went wrong'}
    }
}
export async function postCategory(name:string){
    try{
        const res = await serverFetch(`/api/categories/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: name})
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw errorData;
        }

        revalidateTag('categories');
        return { success: true };
    }catch(error: any){
        if(error?.detail){
            return {success: false, error: error.detail}
        }
        return { error: 'Something went wrong'}
    }
}

export async function getProfile(){
    try{
        const res = await serverFetch(`/auth/users/me/`);
        if (!res.ok) {
            const errorData = await res.json();
            throw errorData;
        }
        const userData = await res.json();
        const profileRes = await serverFetch(`/api/profiles/${userData.username}/`);
        if (!profileRes.ok) {
            const errorData = await profileRes.json();
            throw errorData;
        }
        const data = await profileRes.json();
        return {
            success: true,
            data: data
        };
    }catch(error: any){
        if(error?.detail){
            return {error: error.detail}
        }else if(error?.amount){
            return {success: false, error: error.amount[0]}
        }else if(error?.type){
            return {success: false, error: error.type[0]}
        }else if(error?.category_id){
            return {success: false, error: error.category_id[0]}
        }
        return { success: false, error: 'Something went wrong'}
    }
}
