import AddTransactions from "@/components/app/add-transactions";
import { serverFetch } from "@/lib/server-fetch";
import { CategoryType } from "@/lib/schemas";
import { getUser } from "@/lib/user";

export default async function AddTransaction() {
    let categories: CategoryType[] = [];
    let error: string = '';
    const profileData = await getUser();
    if(typeof profileData === 'string'){
        return null;
    }
    try{
        const categoriesRes = await serverFetch(`/api/categories/`,{
        next: { tags: ['categories'] } 
    });
    const categoriesResJson = await categoriesRes.json();
    categories = categoriesResJson;
    }
    catch(e: any){
        error = e.message || 'Something went wrong'
    }
    return (
        <div className="w-full h-[calc(100vh-3rem)] flex flex-col items-center justify-center">
            {
                error?
                <h1 className="text-destructive">{error}</h1>
                :
            <AddTransactions categories={categories} porfile_id={profileData.id}/>
            }
        </div>
    );
}