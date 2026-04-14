import api from "@/lib/api";
import type { TransactionPostType } from "@/lib/schemas";

const errorHandler = (error: unknown) => {
    const e = error as any;
    const serverError = e?.response?.data;
    if(serverError?.amount){
        return serverError.amount[0]
    }else if(serverError?.detail){
        return serverError.detail
    }else{
        return "Something went wrong"
    }
}
export async function getUserLastActivites(id:number) {
    try {
        const response = await api.get(`/api/transactions/${id}/last-ten-days/`);
        return {
            success:true,
            data:response.data.results
        };
    } catch (error: unknown) {
        const message = errorHandler(error);
        return {
            success:false,
            error: message
        };
    }
}

export async function getUserMonthlyTransactions(id:number) {
    try {
        const response = await api.get(`/api/transactions/${id}/monthly/`);
        return {
            success:true,
            data:response.data.results
        };
    } catch (error: unknown) {
        const message = errorHandler(error);
        return {
            success:false,
            error: message
        };
    }
}

export async function getUserTransactionsByType(id:number,type:string) {
    try {
        const response = await api.get(`/api/transactions/${id}/?type=${type}`);
        return {
            success:true,
            data:response.data
        };
    } catch (error: unknown) {
        const message = errorHandler(error);
        return {
            success:false,
            error: message
        };
    }
}

export async function postUserTransaction(data: TransactionPostType) {
    try {
        const response = await api.post(`/api/transactions/${data.profile_id}/`, data);
        return {
            success:true,
            data:response.data
        };
    } catch (error: unknown) {
        const message = errorHandler(error);
        return {
            success:false,
            error: message
        };
    }
}
export async function getCategories() {
    try {
        const response = await api.get("/api/categories/");
        return {
            success:true,
            data:response.data.results
        };
    } catch (error: unknown) {
        const message = errorHandler(error);
        return {
            success:false,
            error: message
        };
    }
}