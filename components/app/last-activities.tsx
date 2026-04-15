import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { TransactionType } from "@/lib/schemas";
import { getServerApi } from "@/lib/api";
import { cookies } from 'next/headers';
export default async function LastActivities() {
    const api = await getServerApi(cookies);
    const LastActivies= await api.get("/api/transactions/last-ten-days/");
    const transactions:TransactionType[] = Array.isArray(LastActivies.data) ? LastActivies.data : [];
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
                                <div key={transaction.id} className="flex items-center justify-between px-2">
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
                    </CardFooter>
        </Card>
    );
}