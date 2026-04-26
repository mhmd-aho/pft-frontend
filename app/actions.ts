'use server'
import {z} from "zod";
import { revalidateTag } from "next/cache";
import {transactionSchema} from "@/lib/schemas";
import { serverFetch, ApiError } from "@/lib/server-fetch";
import { signinSchema, registerSchema, budgetSchema } from "@/lib/schemas";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
type actionResult<T = undefined>= {success: true , data: T} | {success: false , error: string}
function extractApiError(error: unknown): string {
    if (error instanceof ApiError) return error.message;
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    
    // Fallback for cases where ApiError wasn't used directly
    if (typeof error === 'object' && error !== null) {
        const anyError = error as any;
        if (anyError.detail) return anyError.detail;
        if (anyError.non_field_errors?.[0] && Array.isArray(anyError.non_field_errors)) return anyError.non_field_errors[0];
        const firstKey = Object.keys(anyError)[0];
        const firstError = anyError[firstKey];
        if (Array.isArray(firstError)) return firstError[0];
        if (typeof firstError === 'string') return firstError;
    }
    return 'Something went wrong';
}
export async function signinAction(data:z.infer<typeof signinSchema>): Promise<actionResult>{
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const isJson = res.headers.get('content-type')?.includes('application/json');
        const resData = isJson? await res.json() : null;
        if (!res.ok) {
            throw new ApiError(res.status, resData);
        }
        const token = resData.auth_token;
        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return { success: true, data: resData };
    }catch(error){
        return {success: false, error: extractApiError(error)}
    }
}
export async function signupAction(data:z.infer<typeof registerSchema>): Promise<actionResult>{
    let shouldRedirect = false;
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const isJson = res.headers.get('content-type')?.includes('application/json');
        const resData = isJson? await res.json() : null;
        if (!res.ok) {
            const error = new ApiError(res.status, resData);
            if (error.message.includes('already exists')){
                shouldRedirect = true;
            }
            throw error;
        }else{
            const loginRes = await signinAction({username: data.username, password: data.password});
            if (!loginRes.success) {
                shouldRedirect = true;
            }else{
                return {success: true, data: resData};
            }
        }
    }catch(error){
        if(error instanceof Error && error.message === 'NEXT_REDIRECT') throw error;
        return {success: false, error: extractApiError(error)}
    }
    if (shouldRedirect) {
        redirect('/auth/signin');
    }
}
export async function logoutAction(): Promise<actionResult>{
    try{
        const res = await serverFetch(`/auth/token/logout/`, {
            method: "POST",
        });
        let data = null
        const contentType = res.headers.get('content-type');
        if(res.ok && contentType && contentType.includes("application/json")){
            data = await res.json();
        }
        const cookieStore = await cookies();
        cookieStore.delete("token");
        return { success: true, data: data };
    }catch(error){
        return {success: false, error: extractApiError(error)}
    }
}
export async function postTransaction(data:z.infer<typeof transactionSchema>, profile_id: number) {
    try{
        const res = await serverFetch(`/api/transactions/profile/${profile_id}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({...data, profile_id})
        });

        revalidateTag('transactions');
        return { success: true, data: await res.json() };
    }catch(error){
        return {success: false, error: extractApiError(error)}
    }
}
export async function deleteTransaction(transaction_id: number): Promise<actionResult> {
    try{
        const res = await serverFetch(`/api/transactions/${transaction_id}`, {
            method: "DELETE",
        });

        revalidateTag('transactions');
        return { success: true, data: undefined };
    }catch(error){
        return {success: false, error: extractApiError(error)}
    }
}
export async function getCategories(): Promise<actionResult>{
    try{
        const res = await serverFetch(`/api/categories/`);
        const data = await res.json();
        return {success: true, data: data.results};
    }catch(error){
        return {success: false, error: extractApiError(error)}
    }
}
export async function postCategory(name:string): Promise<actionResult>{
    try{
        const res = await serverFetch(`/api/categories/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: name})
        });

        revalidateTag('categories');
        return { success: true, data: await res.json() };
    }catch(error){
        return {success: false, error: extractApiError(error)}
    }
}

export async function postBudget(data:z.infer<typeof budgetSchema>): Promise<actionResult> {
    try{
        const res = await serverFetch(`/api/budgets/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        revalidateTag('budgets');
        return { success: true, data: await res.json() };
    }catch(error){
        return {success: false, error: extractApiError(error)}
    }
}

export async function patchBudget(data:z.infer<typeof budgetSchema>, budget_id: number): Promise<actionResult> {
    try{
        const res = await serverFetch(`/api/budgets/${budget_id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        revalidateTag('budgets');
        return { success: true, data: await res.json() };
    }catch(error){
        return {success: false, error: extractApiError(error)}
    }
}

export async function deleteBudget(budget_id: number): Promise<actionResult> {
    try{
        const res = await serverFetch(`/api/budgets/${budget_id}/`, {
            method: "DELETE",
        });

        revalidateTag('budgets');
        return { success: true, data: undefined };
    }catch(error){
        return {success: false, error: extractApiError(error)}
    }
}
        