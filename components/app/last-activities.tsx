import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { TransactionType } from "@/lib/schemas";
import { getUser } from "@/lib/user";
import { serverFetch } from "@/lib/server-fetch";
import TransactionsDisplay from "./transactions-display";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
export default async function LastActivities() {
const profileData = await getUser();
if(typeof profileData === 'string'){
    return null;
}
let transactions:TransactionType[] = [];
let error = ''
try{
    const res =  await serverFetch(`/api/transactions/profile/${profileData.id}/last-ten-days/`,{
     next: { tags: ['transactions'] } 
    })
    const resJson = await res.json();
    transactions = resJson.results;
}
catch(e: any){
    error = e.message || 'Something went wrong'
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
                        <Button asChild>
                            <Link href="/dashboard/transaction/add">
                                <Plus className="size-4"/>
                                Add Transaction
                            </Link>
                        </Button>
                    </CardFooter>
        </Card>
    );
}