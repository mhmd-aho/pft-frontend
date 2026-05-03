'use server'
import {z} from "zod";
import { updateTag } from "next/cache";
import {serverFetch, ApiError } from "@/lib/server-fetch";
import { signinSchema, registerSchema, budgetSchema,transactionSchema} from "@/lib/schemas";

import { cookies } from "next/headers";
type TransactionSchemaType = {
    amount: number;
    type: string;
    category_id: number;
    profile_id: string;
}
type actionResult<T = undefined>= {success: true , data: T} | {success: false , error: string}
function extractApiError(error: unknown): string {
    if (error instanceof ApiError) {
        const data = error.data;
        if (data?.detail) return data.detail;
        if (Array.isArray(data?.non_field_errors)) return data.non_field_errors[0];
        if (typeof data === 'object' && data !== null) {
            const errorEntries = Object.entries(data);
            if (errorEntries.length > 0) {
                const [field, messages] = errorEntries[0];
                const displayField = field !== 'non_field_errors' ? `${field}: ` : '';
                
                if (Array.isArray(messages)) return `${displayField}${messages[0]}`;
                if (typeof messages === 'string') return `${displayField}${messages}`;
            }
        }
        return error.message || 'An API error occurred';
    }

    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;

    return 'An unexpected error occurred';
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
            throw new ApiError(res.status,resData);
        }
        return {success: true, data: resData};
    }catch(error){
        return {success: false, error: extractApiError(error)}
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

        updateTag('transactions');
        return { success: true, data: await res.json() };
    }catch(error){
        return {success: false, error: extractApiError(error)}
    }
}
export async function patchTransaction(data:TransactionSchemaType, transaction_id: number): Promise<actionResult> {
    try{
        const res = await serverFetch(`/api/transactions/${transaction_id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        updateTag('transactions');
        return { success: true, data: await res.json() };
    }catch(error){
        return {success: false, error: extractApiError(error)}
    }
}
export async function deleteTransaction(transaction_id: number): Promise<actionResult> {
    try{
        await serverFetch(`/api/transactions/${transaction_id}/`, {
            method: "DELETE",
        });

        updateTag('transactions');
        return { success: true, data: undefined };
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

        updateTag('categories');
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

        updateTag('budgets');
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

        updateTag('budgets');
        return { success: true, data: await res.json() };
    }catch(error){
        return {success: false, error: extractApiError(error)}
    }
}

export async function deleteBudget(budget_id: number): Promise<actionResult> {
    try{
        await serverFetch(`/api/budgets/${budget_id}/`, {
            method: "DELETE",
        });
        updateTag('budgets');
        return { success: true, data: undefined };
    }catch(error){
        return {success: false, error: extractApiError(error)}
    }
}
        