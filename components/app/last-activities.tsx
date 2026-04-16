import { CookieValueTypes } from "cookies-next";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { TransactionType,ProfileType } from "@/lib/schemas";
import { getUser } from "@/lib/user";
import AddTransactions from "./addTransactions";
export default async function LastActivities() {
const {profileData,token}: {profileData:ProfileType,token:CookieValueTypes} | null = await getUser();
if(!profileData || !token){
    return null;
}
let transactions:TransactionType[] = [];
try{
    const res =  await fetch(`http://127.0.0.1:8000/api/transactions/${profileData.id}/last-ten-days/`,{
     headers:{
        Authorization:`Token ${token}`
     }
    })
    const resJson = await res.json();
    transactions = resJson.results;

}
catch(error){
    console.log(error)
}

const option:Intl.DateTimeFormatOptions = {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}
return (
    <Card className="sm:col-start-4 col-start-1 sm:col-end-7 sm:row-start-2 sm:row-end-6 row-start-8 row-end-13 max-sm:col-span-2 max-sm:gap-1 max-sm:py-1">
                    <CardHeader>
                        <CardTitle className="sm:text-3xl text-xl">Transactions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-3 max-sm:gap-1 max-sm:py-1">
                        <h3 className="sm:text-xl text-lg">Last 10 days activities</h3>
                        <div className="h-4/5 flex flex-col gap-1 overflow-y-scroll">
                        {
                            transactions.map((transaction) => (
                                <div key={transaction.id+transaction.created_at} className="flex items-center justify-between px-2">
                                    <div>
                                        <p className="sm:text-lg text-md">{transaction.category.name}</p>
                                        <p className="text-sm text-muted-foreground">{new Date(transaction.created_at).toLocaleDateString('en-US',option)}</p>
                                    </div>
                                    <p className={`sm:text-lg text-md ${transaction.type === "income" ? "text-success" : "text-destructive"}`}>{transaction.type === "income" ? "+" : "-"}{transaction.amount}</p>
                                </div>
                            ))
                        }
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <AddTransactions />
                    </CardFooter>
        </Card>
    );
}