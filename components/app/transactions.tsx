'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
import { toast } from "sonner";
import type { TransactionType } from "@/lib/schemas";
import { getUserTransactions, postUserTransaction, getCategories } from "@/app/actions";
import { useProfile } from "@/context/Profile";
import { Skeleton } from "../ui/skeleton";
export default function Transactions() {
    const {profile,loading} = useProfile();
    const [categories,setCategories] = useState<{id: number, name: string}[]>([]);
    const [type,setType] = useState<string>("");
    const [category,setCategory] = useState<string>("");
    const [amount,setAmount] = useState<number>(0);
    const [transactions,setTransactions] = useState<TransactionType[]>([]);
   useEffect(() => {
    const fetchCategories = async () => {
        const response = await getCategories();
        if(response.success){
            setCategories(response.data);
        }
    }
    fetchCategories();
   },[]);
    const handleAddTransaction = async() => {
        if(!type || !category || !amount){
            toast.error("Please fill all the fields");
            return;
        }
        if(!profile){
            toast.error("Please login");
            return;
        }
        const response = await postUserTransaction({
            type: type,
            category_id: parseInt(category),
            amount:amount,
            profile_id: profile.id,    
        });
        if(response.success){
            toast.success("Transaction added successfully");
        }else{
            toast.error(response.error);
        }
    }
    useEffect(() => {
        if(!profile){
            return;
        }
        const fetchTransactions = async () => {
            const response = await getUserTransactions(profile.id);
            if(response.success){
                setTransactions(response.data);
            }else{
                toast.error(response.error);
            }
            return response;
        }
        fetchTransactions();
    },[profile]);
    if(loading){
        return(
            <Card className="col-start-4 col-end-7 row-start-2 row-end-6">
                    <CardHeader>
                        <CardTitle className="text-3xl">Transactions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-3">
                        <h1 className="text-xl">Recent Activities</h1>
                        <div className="flex-1 flex flex-col gap-1">
                            {
                                Array.from({length: 5}).map((_,i) => (
                                    <Skeleton key={i} className="w-full h-10 mx-1" />
                                ))
                            }
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                       <Skeleton className="w-32 h-10" />
                    </CardFooter>
        </Card>
        )
    }
    return (
    <Card className="col-start-4 col-end-7 row-start-2 row-end-6">
                    <CardHeader>
                        <CardTitle className="text-3xl">Transactions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-3">
                        <h1 className="text-xl">Recent Activities</h1>
                        <div className="flex-1 flex flex-col gap-1">
                            {transactions.map((transaction) => (
                                <div key={transaction.created_at.toString()} className="flex items-center justify-between px-2">
                                    <div>
                                        <h1 className="text-lg">{transaction.category.name}</h1>
                                        <p className="text-sm text-muted-foreground">{new Date(transaction.created_at).toDateString()}</p>
                                    </div>
                                    <p className={`text-lg ${transaction.type === "income" ? "text-success" : "text-destructive"}`}>{transaction.type === "income" ? "+" : "-"}{transaction.amount}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button><Plus className="size-4"/> Add Transaction</Button>
                            </PopoverTrigger>
                            <PopoverContent className="h-fit">
                                    <Input type="number" placeholder="Amount" onChange={(e) => setAmount(Number(e.target.value))} />
                                    <NativeSelect className="w-full" onChange={(e) => setType(e.target.value)}>
                                        <NativeSelectOption>Select Type</NativeSelectOption>
                                        <NativeSelectOption value="income">Income</NativeSelectOption>
                                        <NativeSelectOption value="expense">Expense</NativeSelectOption>
                                    </NativeSelect>
                                    <NativeSelect className="w-full" onChange={(e) => setCategory(e.target.value)}>
                                        <NativeSelectOption>Select Category</NativeSelectOption>
                                        {categories.map((category) => (
                                            <NativeSelectOption key={category.id} value={category.id}>{category.name}</NativeSelectOption>
                                        ))}
                                    </NativeSelect>
                                    <Button onClick={handleAddTransaction}>Add Transaction</Button>
                            </PopoverContent>
                        </Popover>
                    </CardFooter>
        </Card>
    );
}