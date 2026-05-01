import TransactionDetail from "@/components/app/transaction-detail";
import { TransactionType,CategoryType } from "@/lib/schemas";
import { serverFetch } from "@/lib/server-fetch";
import { getUser } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function Transaction({params}: {params: {id: number}}) {
    const profile = await getUser();
    if(typeof profile === 'string'){
        redirect('/auth/signin');
    }
    const profileId = profile.id
    const {id} = await params;
    const response = await serverFetch(`/api/transactions/${id}/`)
    const transaction:TransactionType = await response.json();
    const categoriesResponse = await serverFetch('/api/categories');
    const categoriesJson = await categoriesResponse.json();
    const categories:CategoryType[] = categoriesJson;
    return (
        <div className="w-full h-[calc(100vh-3rem)] flex justify-center items-center">
            <TransactionDetail transaction={transaction} categories={categories} profileId={profileId}/>
        </div>
    );
}