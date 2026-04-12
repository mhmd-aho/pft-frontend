"use client"
import { useProfile } from "@/context/Profile";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { getUserTransactionsByType } from "@/app/actions";
import type { TransactionType } from "@/lib/schemas";

export default function Incoms() {
    const {profile} = useProfile();
    const [transactions,setTransactions] = useState<TransactionType[]>([]);
    useEffect(() => {
        if(profile){
            const fetchTransactions = async () => {
                const response = await getUserTransactionsByType(profile.id,"income");
                if(response.success){
                    setTransactions(response.data);
                }
            }
            fetchTransactions();
        }
    },[profile]);
    const totalIncome = transactions.reduce((acc,transaction) => acc + Number(transaction.amount),0);
    return (
        <Card className="col-start-3 col-span-2 row-start-1">
                    <CardHeader>
                        <CardTitle className="text-3xl">Incomes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h1 className="text-xl">{totalIncome.toFixed(2)} $ </h1>
                    </CardContent>
        </Card>
    );
}