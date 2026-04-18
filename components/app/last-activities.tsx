import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { CategoryType, TransactionType } from "@/lib/schemas";
import { getUser } from "@/lib/user";
import AddTransactions from "./addTransactions";
import { serverFetch } from "@/lib/server-fetch";
import TransactionsDisplay from "./transactions-display";
export default async function LastActivities() {
const profileData = await getUser();
if(typeof profileData === 'string'){
    return null;
}
let transactions:TransactionType[] = [];
let categories:CategoryType[] = [];
let error = ''
try{
    const res =  await serverFetch(`/api/transactions/${profileData.id}/last-ten-days/`,{
     next: { tags: ['transactions'] } 
    })
    const resJson = await res.json();
    transactions = resJson.results;
    const categoriesRes = await serverFetch(`/api/categories/`,{
        next: { tags: ['categories'] } 
    });
    const categoriesResJson = await categoriesRes.json();
    categories = categoriesResJson.results;
}
catch{
    error = 'Something is wrong'
}

return (
    <Card className="sm:col-start-4 col-start-1 sm:col-end-7 sm:row-start-2 sm:row-end-6 row-start-8 row-end-13 max-sm:col-span-2 max-sm:gap-1 max-sm:py-1 h-full">
                    <CardHeader>
                        <CardTitle className="sm:text-3xl text-xl">Transactions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0 flex flex-col gap-3 max-sm:gap-1 max-sm:py-1 px-0">
                        <h3 className="sm:text-xl text-lg pl-5">Last 10 days activities ({transactions.length})</h3>
                        <TransactionsDisplay transactions={transactions} error={error} />
                    </CardContent>
                    <CardFooter className="flex justify-end shrink-0">
                        <AddTransactions categories={categories} />
                    </CardFooter>
        </Card>
    );
}