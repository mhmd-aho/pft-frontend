'use server'
import {z} from "zod";
import { revalidateTag } from "next/cache";
import {transactionSchema} from "@/lib/schemas";
import { serverFetch } from "@/lib/server-fetch";
import { signinSchema, registerSchema, budgetSchema } from "@/lib/schemas";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
type actionResult<T = undefined>= {success: true , data: T} | {success: false , error: string}
function extractApiError(error: unknown): string {
    if (typeof error === 'string') return error;
    if (error?.detail) return error.detail;
    if (error?.non_field_errors?.[0] && Array.isArray(error.non_field_errors)) return error.non_field_errors[0];
    if (typeof error === 'object' && error !== null) {
        const firstKey = Object.keys(error)[0];
        const firstError = error[firstKey];
        if (Array.isArray(firstError)) return firstError[0];
        if (typeof firstError === 'string') return firstError;
        if (typeof error === 'object') return extractApiError(firstError);
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
            const errorMessage = extractApiError(resData) | 'ServerError';
            return {success: false, error: errorMessage}
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
            const errorMessage = extractApiError(resData) || 'ServerError';
            if (errorMessage.includes('already exists')){
                shouldRedirect = true;
            }
            return {success: false, error: errorMessage}
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
        if (!res.ok) {
            const errorData = await res.json();
            throw errorData;
        }
        const cookieStore = await cookies();
        cookieStore.set("token", "", {
            maxAge: 0,
            path: "/",
        });
        return { success: true, data: await res.json() };
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

        if (!res.ok) {
            const errorData = await res.json();
            throw errorData;
        }

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

        if (!res.ok) {
            const errorData = await res.json();
            throw errorData;
        }

        revalidateTag('transactions');
        return { success: true, data: undefined };
    }catch(error){
        return {success: false, error: extractApiError(error)}
    }
}
export async function getCategories(): Promise<actionResult>{
    try{
        const res = await serverFetch(`/api/categories/`);
        if (!res.ok) {
            const errorData = await res.json();
            throw errorData;
        }
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

        if (!res.ok) {
            const errorData = await res.json();
            throw errorData;
        }

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

        if (!res.ok) {
            const errorData = await res.json();
            throw errorData;
        }

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

        if (!res.ok) {
            const errorData = await res.json();
            throw errorData;
        }

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

        if (!res.ok) {
            const errorData = await res.json();
            throw errorData;
        }

        revalidateTag('budgets');
        return { success: true, data: undefined };
    }catch(error){
        return {success: false, error: extractApiError(error)}
    }
}
        