"use client"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useProfile } from "@/context/Profile";
import { useEffect, useState, useMemo } from "react";
import { getUserTransactionsByType } from "@/app/actions";
import type { TransactionType } from "@/lib/schemas";

export default function Expenses() {
    const {profile} = useProfile();
    const [transactions, setTransactions] = useState<TransactionType[]>([]);
    useEffect(() => {
        if(profile){
            const fetchTransactions = async () => {
                const response = await getUserTransactionsByType(profile.id,"expense");
                if(response.success){
                    setTransactions(response.data);
                }
            };
            fetchTransactions();
        }
    },[profile]);
    const totalExpenses = useMemo(() => {
        return transactions.reduce((acc,transaction) => acc + Number(transaction.amount),0);
    },[transactions]);
    return (
        <Card className="col-start-5 col-span-2 row-start-1">
                    <CardHeader>
                        <CardTitle className="text-3xl">Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h1 className="text-xl">{totalExpenses.toFixed(2)} $</h1>
                    </CardContent>
        </Card>
    );
}