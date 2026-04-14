import api from "@/lib/api";
import type { TransactionPostType } from "@/lib/schemas";

export async function getUserLastActivites(id:number) {
    try {
        const response = await api.get(`/api/transactions/${id}/last-ten-days/`);
        return {
            success:true,
            data:response.data.results
        };
    } catch (error:any) {
        const serverError = error.response?.data;
        if(serverError?.amount){
            return {
                success:false,
                error: serverError.amount[0]
            };
        }else if(serverError?.detail){
            return {
                success:false,
                error: serverError.detail
            };
        }else{
            return {
                success:false,
                error: "Something went wrong"
            };
        }
    }
}

export async function getUserMonthlyTransactions(id:number) {
    try {
        const response = await api.get(`/api/transactions/${id}/monthly/`);
        return {
            success:true,
            data:response.data.results
        };
    } catch (error:any) {
        const serverError = error.response?.data;
        if(serverError?.amount){
            return {
                success:false,
                error: serverError.amount[0]
            };
        }else if(serverError?.detail){
            return {
                success:false,
                error: serverError.detail
            };
        }else{
            return {
                success:false,
                error: "Something went wrong"
            };
        }
    }
}

export async function getUserTransactionsByType(id:number,type:string) {
    try {
        const response = await api.get(`/api/transactions/${id}/?type=${type}`);
        return {
            success:true,
            data:response.data
        };
    } catch (error:any) {
        const serverError = error.response?.data;
        if(serverError?.amount){
            return {
                success:false,
                error: serverError.amount[0]
            };
        }else if(serverError?.detail){
            return {
                success:false,
                error: serverError.detail
            };
        }else{
            return {
                success:false,
                error: "Something went wrong"
            };
        }
    }
}

export async function postUserTransaction(data:TransactionPostType) {
    try {
        const response = await api.post(`/api/transactions/${data.profile_id}/`, data);
        return {
            success:true,
            data:response.data
        };
    } catch (error:any) {
        const serverError = error.response?.data;
        if(serverError?.amount){
            return {
                success:false,
                error: serverError.amount[0]
            };
        }else if(serverError?.detail){
            return {
                success:false,
                error: serverError.detail
            };
        }else{
            return {
                success:false,
                error: "Something went wrong"
            };
        }
    }
}
export async function getCategories() {
    try {
        const response = await api.get("/api/categories/");
        return {
            success:true,
            data:response.data.results
        };
    } catch (error: any) {
        const serverError = error.response?.data;
        if(serverError?.amount){
            return {
                success:false,
                error: serverError.amount[0]
            };
        }else if(serverError?.detail){
            return {
                success:false,
                error: serverError.detail
            };
        }else{
            return {
                success:false,
                error: "Something went wrong"
            };
        }
    }
}