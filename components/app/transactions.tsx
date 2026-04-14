"use client"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useProfile } from "@/context/Profile";
import { useEffect, useState, useMemo, useTransition } from "react";
import { getUserTransactionsByType } from "@/app/actions";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import type { TransactionType } from "@/lib/schemas";
import { format } from "@/lib/utils";
export default function Transactions({type}: {type: "expense" | "income"}) {
    const {profile} = useProfile();
    const [transactions, setTransactions] = useState<TransactionType[]>([]);
    const [isPending,startTransition] = useTransition();
    const positions={
        income:"sm:col-start-3 sm:col-span-2 sm:row-start-1 row-start-2 col-start-1",
        expense:"sm:col-start-5 sm:col-span-2 sm:row-start-1 row-start-2 col-start-2"
    }
    useEffect(() => {
        if(profile){
            const fetchTransactions = () => {
                startTransition(async () => {
                    const response = await getUserTransactionsByType(profile.id,type);
                    if(response.success){
                        setTransactions(response.data);
                    }else{
                        toast.error(response.error);
                    }
                });
            };
            fetchTransactions();
        }
    },[profile]);
    const total = useMemo(() => {
        return transactions.reduce((acc,transaction) => acc + Number(transaction.amount),0);
    },[transactions]);
    const formattedTotal = format.format(total);
    return (
        <Card className={`${positions[type]} max-sm:gap-1 max-sm:py-1`}>
                    <CardHeader>
                        <CardTitle className="sm:text-3xl text-xl">{type === "expense" ? "Expenses" : "Incomes"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isPending ? <Skeleton className="w-full h-5" /> : <p className="sm:text-xl text-lg">{formattedTotal}</p>}
                    </CardContent>
        </Card>
    );
}