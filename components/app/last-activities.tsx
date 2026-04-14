'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState, useEffect, useTransition } from "react";
import { Input } from "../ui/input";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
import { toast } from "sonner";
import { transactionSchema } from "@/lib/schemas";
import type { TransactionType } from "@/lib/schemas";
import { getUserLastActivites, postUserTransaction, getCategories } from "@/app/actions";
import { useProfile } from "@/context/Profile";
import { Skeleton } from "../ui/skeleton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
type TransactionForm = z.infer<typeof transactionSchema>
export default function LastActivities() {
    const {profile,loading} = useProfile();
    const [isPending,startTransition] = useTransition()
    const [categories,setCategories] = useState<{id: number, name: string}[]>([]);
    const [categoriesLoading,setCategoriesLoading] = useState(true);
    const [transactions,setTransactions] = useState<TransactionType[]>([]);
    const {register,handleSubmit,formState:{errors}} = useForm<TransactionForm>({
        resolver: zodResolver(transactionSchema),
        defaultValues:{
            category_id: undefined,
            type:undefined,
            amount: 0
        }
    })
    const onSubmit = (data: TransactionForm)=>{
        startTransition( async()=>{
            if(!profile){
                toast.error('You need to be logged in to add a transaction');
                return;
            }
            const response = await postUserTransaction({
                category_id: data.category_id,
                type: data.type,
                amount: data.amount,
                profile_id:profile.id})
            if(response.success){
                toast.success('Transaction added successfully')
                const update = await getUserLastActivites(profile.id);
                if(update.success){
                    setTransactions(update.data);
                }
            }else{
                toast.error(response.error)
            }

        })
    }
   useEffect(() => {
    const fetchCategories = async () => {
        const response = await getCategories();
        if(response.success){
            setCategories(response.data);
            setCategoriesLoading(false);
        }
    }
    fetchCategories();
   },[]);
    
      
    useEffect(() => {
        if(!profile){
            return;
        }
        const fetchTransactions = async () => {
            const response = await getUserLastActivites(profile.id);
            if(response.success){
                setTransactions(response.data);
            }else{
                toast.error(response.error);
            }
            return response;
        }
        fetchTransactions();
    },[profile]);
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
                            loading?
                                Array.from({length: 5}).map((_,i) => (
                                    <Skeleton key={i} className="w-full sm:h-10 h-5 mx-1" />
                                ))
                            :
                            transactions.length === 0 ? (
                                <p className="text-center sm:text-lg text-md">No transactions yet</p>
                            ) : (
                            transactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between px-2">
                                    <div>
                                        <p className="sm:text-lg text-md">{transaction.category.name}</p>
                                        <p className="text-sm text-muted-foreground">{new Date(transaction.created_at).toLocaleDateString('en-US',option)}</p>
                                    </div>
                                    <p className={`sm:text-lg text-md ${transaction.type === "income" ? "text-success" : "text-destructive"}`}>{transaction.type === "income" ? "+" : "-"}{transaction.amount}</p>
                                </div>
                            ))
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Popover>
                            <PopoverTrigger disabled={categoriesLoading} asChild>
                                {
                                    loading?
                                    <Skeleton className="w-full h-10" />
                                    :
                                    <Button className="max-sm:w-full"><Plus className="size-4"/> Add Transaction</Button>
                                }
                            </PopoverTrigger>
                            <PopoverContent className="h-fit w-80">
                                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="amount">Amount</Label>
                                        <Input type='number' step='0.01' placeholder='0.00' {...register("amount",{valueAsNumber:true})} />
                                        {errors.amount && <p className="text-destructive">{errors.amount.message}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="type">Type</Label>
                                        <NativeSelect className="w-full" {...register("type")}>
                                            <NativeSelectOption value=''>Select Type</NativeSelectOption>
                                            <NativeSelectOption value="income">Income</NativeSelectOption>
                                            <NativeSelectOption value="expense">Expense</NativeSelectOption>
                                        </NativeSelect>
                                        {errors.type && <p className="text-destructive">{errors.type.message}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="category_id">Category</Label>
                                        <NativeSelect className="w-full" {...register("category_id")}>
                                            <NativeSelectOption value=''>Select Category</NativeSelectOption>
                                            {categories.map((category) => (
                                                <NativeSelectOption key={category.id} value={category.id}>{category.name}</NativeSelectOption>
                                            ))}
                                        </NativeSelect>
                                        {errors.category_id && <p className="text-destructive">{errors.category_id.message}</p>}
                                    </div>
                                    <Button disabled={isPending}  type="submit">Add Transaction</Button>
                                </form>
                            </PopoverContent>
                        </Popover>
                    </CardFooter>
        </Card>
    );
}